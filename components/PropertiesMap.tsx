'use client';
import { useEffect } from 'react';

const MARKERS = [
  {
    id: 'risoul',
    lat: 44.6267,
    lng: 6.6261,
    label: 'Risoul 1850',
    sub: 'Hautes-Alpes · Ski',
    emoji: '⛷',
    color: '#1A5276',
    url: '/fr/biens/risoul',
  },
  {
    id: 'avignon',
    lat: 43.9493,
    lng: 4.8055,
    label: 'Avignon',
    sub: 'Vaucluse · Intramuros',
    emoji: '🏛️',
    color: '#C8763A',
    url: '/fr/biens/avignon',
  },
  {
    id: 'lauris',
    lat: 43.7375,
    lng: 5.3097,
    label: 'Lauris · Luberon',
    sub: 'Vaucluse · Village perché',
    emoji: '🌿',
    color: '#6B7C45',
    url: '/fr/biens#luberon',
  },
];

export default function PropertiesMap() {
  useEffect(() => {
    // Charger Leaflet uniquement côté client
    import('leaflet').then((L) => {
      // Éviter double initialisation
      const container = document.getElementById('4ar-map') as HTMLElement & { _leaflet_id?: number };
      if (!container || container._leaflet_id) return;

      // Fix icônes par défaut Leaflet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map('4ar-map', {
        center: [44.1, 5.6],
        zoom: 7,
        scrollWheelZoom: false,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      MARKERS.forEach((m) => {
        const icon = L.divIcon({
          className: '',
          html: `
            <div style="
              background:${m.color};
              color:white;
              border-radius:50% 50% 50% 0;
              transform:rotate(-45deg);
              width:40px;height:40px;
              display:flex;align-items:center;justify-content:center;
              box-shadow:0 2px 8px rgba(0,0,0,0.3);
              border:2px solid white;
              cursor:pointer;
            ">
              <span style="transform:rotate(45deg);font-size:18px">${m.emoji}</span>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -42],
        });

        const popup = L.popup({ maxWidth: 220, className: '4ar-popup' }).setContent(`
          <div style="font-family:sans-serif;padding:4px 2px">
            <div style="font-weight:700;font-size:14px;color:#2C2416;margin-bottom:2px">${m.emoji} ${m.label}</div>
            <div style="font-size:11px;color:#9B8A74;margin-bottom:8px">${m.sub}</div>
            <a href="${m.url}" style="
              display:inline-block;
              background:${m.color};
              color:white;
              font-size:11px;
              font-weight:600;
              padding:5px 12px;
              border-radius:8px;
              text-decoration:none;
            ">Voir le logement →</a>
          </div>
        `);

        L.marker([m.lat, m.lng], { icon }).bindPopup(popup).addTo(map);
      });
    });
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8DCC8] shadow-sm">
      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div id="4ar-map" style={{ height: '420px', width: '100%' }} />
    </div>
  );
}
