export default function HeroEmblems() {
  const w1a = 'M 36,184 Q 65,180 94,184 Q 123,188 152,184 Q 181,180 210,184 Q 218,188 224,184';
  const w1b = 'M 36,184 Q 65,188 94,184 Q 123,180 152,184 Q 181,188 210,184 Q 218,180 224,184';
  const w2a = 'M 36,196 Q 72,192 108,196 Q 144,200 180,196 Q 208,192 224,196';
  const w2b = 'M 36,196 Q 72,200 108,196 Q 144,192 180,196 Q 208,200 224,196';

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden select-none hidden md:block"
      aria-hidden="true"
    >
      {/* ══════════════════════════════════════════
          🏰  CHÂTEAU DE LAURIS — Luberon
      ══════════════════════════════════════════ */}
      <div className="hero-emblem hero-emblem-1 absolute" style={{ right: '2%', top: '3%' }}>
        <svg width="330" height="330" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="lb-bot" d="M 20,170 A 117,117 0 0 0 240,170" />
          </defs>

          {/* Outer ring CCW 60s */}
          <circle cx="130" cy="130" r="117" fill="none" stroke="white" strokeWidth="0.65" strokeDasharray="2.5 7">
            <animateTransform attributeName="transform" type="rotate"
              from="0 130 130" to="-360 130 130" dur="60s" repeatCount="indefinite" />
          </circle>
          {/* Inner ring CW 28s */}
          <circle cx="130" cy="130" r="88" fill="none" stroke="white" strokeWidth="0.55" strokeDasharray="1 5">
            <animateTransform attributeName="transform" type="rotate"
              from="0 130 130" to="360 130 130" dur="28s" repeatCount="indefinite" />
          </circle>

          {/* ── Toit presque plat ── */}
          <rect x="72" y="76" width="116" height="8" fill="none" stroke="white" strokeWidth="1.0" />
          {/* Mât et drapeau */}
          <line x1="130" y1="76" x2="130" y2="62" stroke="white" strokeWidth="0.7" />
          <path fill="none" stroke="white" strokeWidth="0.6" d="M 130,62 L 144,66 L 130,72">
            <animate attributeName="d"
              values="M130,62 L144,66 L130,72;M130,62 L145,65 L131,71;M130,62 L143,67 L130,73;M130,62 L144,66 L130,72"
              dur="3.2s" repeatCount="indefinite"/>
          </path>

          {/* ── Corps du château ── */}
          <rect x="72" y="84" width="116" height="48" fill="none" stroke="white" strokeWidth="1.0" />

          {/* String courses */}
          <line x1="72" y1="100" x2="188" y2="100" stroke="white" strokeWidth="0.55" />
          <line x1="72" y1="116" x2="188" y2="116" stroke="white" strokeWidth="0.50" />

          {/* Fenêtres à volets — rangée 1 */}
          {[78,95,112,129,146,163,175].map(x => (
            <g key={x}>
              <rect x={x} y="86" width="10" height="12" fill="none" stroke="white" strokeWidth="0.65" />
              <line x1={x-2} y1="86" x2={x-2} y2="98" stroke="white" strokeWidth="0.5" />
              <line x1={x+12} y1="86" x2={x+12} y2="98" stroke="white" strokeWidth="0.5" />
            </g>
          ))}
          {/* Fenêtres rangée 2 */}
          {[78,95,112,129,146,163,175].map(x => (
            <g key={x}>
              <rect x={x} y="103" width="10" height="12" fill="none" stroke="white" strokeWidth="0.65" />
              <line x1={x-2} y1="103" x2={x-2} y2="115" stroke="white" strokeWidth="0.5" />
              <line x1={x+12} y1="103" x2={x+12} y2="115" stroke="white" strokeWidth="0.5" />
            </g>
          ))}
          {/* Fenêtres rangée 3 */}
          {[78,95,112,129,146,163,175].map(x => (
            <g key={x}>
              <rect x={x} y="119" width="10" height="12" fill="none" stroke="white" strokeWidth="0.65" />
              <line x1={x-2} y1="119" x2={x-2} y2="131" stroke="white" strokeWidth="0.5" />
              <line x1={x+12} y1="119" x2={x+12} y2="131" stroke="white" strokeWidth="0.5" />
            </g>
          ))}

          {/* ── Falaise calcaire ── */}
          <path fill="none" stroke="white" strokeWidth="0.9"
            d="M 72,132 L 82,124 L 94,132 L 108,120 L 122,128 L 138,116 L 154,124 L 168,112 L 182,120 L 188,115 L 188,132" />
          {/* Strates de falaise */}
          <path fill="none" stroke="white" strokeWidth="0.4" strokeDasharray="3 4"
            d="M 72,140 L 90,135 L 116,140 L 144,135 L 170,140 L 188,136" />

          {/* Garrigue */}
          <ellipse cx="80" cy="147" rx="8" ry="4" fill="none" stroke="white" strokeWidth="0.55" />
          <ellipse cx="114" cy="150" rx="10" ry="4" fill="none" stroke="white" strokeWidth="0.55" />
          <ellipse cx="152" cy="149" rx="9" ry="4" fill="none" stroke="white" strokeWidth="0.55" />
          <ellipse cx="180" cy="147" rx="7" ry="4" fill="none" stroke="white" strokeWidth="0.55" />

          {/* Cyprès */}
          <ellipse cx="74" cy="110" rx="2.5" ry="14" fill="none" stroke="white" strokeWidth="0.7" />
          <ellipse cx="186" cy="108" rx="2.5" ry="14" fill="none" stroke="white" strokeWidth="0.7" />

          {/* ── Terrasses / arcade ── */}
          <line x1="68" y1="154" x2="192" y2="154" stroke="white" strokeWidth="1.0" />
          <line x1="68" y1="168" x2="192" y2="168" stroke="white" strokeWidth="0.9" />
          {/* 5 niches en arc */}
          {[74,94,114,134,154].map(x => (
            <path key={x} fill="none" stroke="white" strokeWidth="0.7"
              d={`M ${x},168 L ${x},158 A 10,11 0 0 1 ${x+18},158 L ${x+18},168`} />
          ))}
          {/* Pilastres */}
          {[92,112,132,152].map(x => (
            <line key={x} x1={x} y1="154" x2={x} y2="168" stroke="white" strokeWidth="0.4" />
          ))}

          {/* Vignes */}
          <line x1="68" y1="175" x2="192" y2="175" stroke="white" strokeWidth="0.45" strokeDasharray="2.5 4" />
          <line x1="68" y1="182" x2="192" y2="182" stroke="white" strokeWidth="0.4" strokeDasharray="2 3.5" />

          {/* Text */}
          <text fill="white" fontSize="7" fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="3.5" opacity="0.7" textAnchor="middle">
            <textPath href="#lb-bot" startOffset="50%">· CHÂTEAU DE LAURIS · LUBERON ·</textPath>
          </text>
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          🏛  PALAIS DES PAPES + PONT D'AVIGNON
      ══════════════════════════════════════════ */}
      <div className="hero-emblem hero-emblem-2 absolute" style={{ right: '23%', bottom: '3%' }}>
        <svg width="252" height="252" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="av-bot" d="M 20,170 A 117,117 0 0 0 240,170" />
          </defs>

          {/* Outer ring CW 65s */}
          <circle cx="130" cy="130" r="117" fill="none" stroke="white" strokeWidth="0.65" strokeDasharray="2.5 7">
            <animateTransform attributeName="transform" type="rotate"
              from="0 130 130" to="360 130 130" dur="65s" repeatCount="indefinite" />
          </circle>

          {/* Tour des Anges — gauche, la plus haute */}
          <rect x="74" y="68" width="24" height="92" fill="none" stroke="white" strokeWidth="1.1" />
          {[73,80,87,94].map(x => (
            <rect key={x} x={x} y="62" width="4" height="7" fill="none" stroke="white" strokeWidth="0.8" />
          ))}
          <path fill="none" stroke="white" strokeWidth="0.65" d="M 79,84 A 5,5 0 0 1 89,84 L 89,94 L 79,94 Z" />
          <path fill="none" stroke="white" strokeWidth="0.65" d="M 79,104 A 5,5 0 0 1 89,104 L 89,114 L 79,114 Z" />

          {/* Corps central */}
          <rect x="98" y="96" width="64" height="64" fill="none" stroke="white" strokeWidth="1.1" />
          {[101,108,115,122,129,136,143,150].map(x => (
            <rect key={x} x={x} y="90" width="4" height="7" fill="none" stroke="white" strokeWidth="0.75" />
          ))}

          {/* Tour de la Campane — droite */}
          <rect x="162" y="76" width="22" height="84" fill="none" stroke="white" strokeWidth="1.0" />
          {[161,168,175,180].map(x => (
            <rect key={x} x={x} y="70" width="4" height="7" fill="none" stroke="white" strokeWidth="0.8" />
          ))}
          <path fill="none" stroke="white" strokeWidth="0.65" d="M 167,90 A 5,5 0 0 1 177,90 L 177,100 L 167,100 Z" />

          {/* Portail ogival */}
          <path fill="none" stroke="white" strokeWidth="1.1"
            d="M 113,160 L 113,134 C 113,120 147,120 147,134 L 147,160" />
          {/* Rose window */}
          <circle cx="130" cy="116" r="7" fill="none" stroke="white" strokeWidth="0.7">
            <animateTransform attributeName="transform" type="rotate"
              from="0 130 116" to="360 130 116" dur="22s" repeatCount="indefinite" />
          </circle>
          {[0,60,120,180,240,300].map(deg => (
            <circle key={deg}
              cx={130 + 4.5 * Math.sin(deg * Math.PI / 180)}
              cy={116 - 4.5 * Math.cos(deg * Math.PI / 180)}
              r="1.8" fill="none" stroke="white" strokeWidth="0.55" />
          ))}
          <circle cx="130" cy="116" r="1.8" fill="none" stroke="white" strokeWidth="0.55" />

          <path fill="none" stroke="white" strokeWidth="0.6" d="M 102,108 A 4,4 0 0 1 110,108 L 110,116 L 102,116 Z" />
          <path fill="none" stroke="white" strokeWidth="0.6" d="M 150,108 A 4,4 0 0 1 158,108 L 158,116 L 150,116 Z" />

          {/* Rocher des Doms */}
          <path fill="none" stroke="white" strokeWidth="0.75"
            d="M 56,160 C 68,155 80,160 98,160 L 162,160 C 180,160 192,155 204,160" />

          {/* Pont d'Avignon */}
          <rect x="54" y="163" width="152" height="5" fill="none" stroke="white" strokeWidth="0.85" />
          <line x1="54" y1="156" x2="206" y2="156" stroke="white" strokeWidth="0.55" />
          <path fill="none" stroke="white" strokeWidth="1.2" d="M 60,168 A 14,14 0 0 1 88,168" />
          <path fill="none" stroke="white" strokeWidth="1.2" d="M 93,168 A 14,14 0 0 1 121,168" />
          <path fill="none" stroke="white" strokeWidth="1.2" d="M 126,168 A 14,14 0 0 1 154,168" />
          <path fill="none" stroke="white" strokeWidth="1.0" strokeDasharray="3 3"
            d="M 160,168 A 14,14 0 0 1 188,168" />
          <rect x="88" y="168" width="5" height="20" fill="none" stroke="white" strokeWidth="0.6" />
          <rect x="121" y="168" width="5" height="20" fill="none" stroke="white" strokeWidth="0.6" />
          <rect x="154" y="168" width="6" height="20" fill="none" stroke="white" strokeWidth="0.6" />

          <line x1="36" y1="188" x2="224" y2="188" stroke="white" strokeWidth="0.5" />
          <path fill="none" stroke="white" strokeWidth="0.6" d={w1a}>
            <animate attributeName="d" values={`${w1a};${w1b};${w1a}`} dur="4.5s" repeatCount="indefinite" />
          </path>
          <path fill="none" stroke="white" strokeWidth="0.45" d={w2a}>
            <animate attributeName="d" values={`${w2a};${w2b};${w2a}`} dur="7s" repeatCount="indefinite" />
          </path>

          <text fill="white" fontSize="7" fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="2.5" opacity="0.7" textAnchor="middle">
            <textPath href="#av-bot" startOffset="50%">· PALAIS DES PAPES · AVIGNON ·</textPath>
          </text>
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          ⛷  MONTAGNE SKI — Risoul 1850
      ══════════════════════════════════════════ */}
      <div className="hero-emblem hero-emblem-3 absolute" style={{ right: '-1%', bottom: '7%' }}>
        <svg width="278" height="278" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <path id="rs-bot" d="M 20,170 A 117,117 0 0 0 240,170" />
          </defs>

          {/* Outer ring CCW 55s */}
          <circle cx="130" cy="130" r="117" fill="none" stroke="white" strokeWidth="0.65" strokeDasharray="2.5 7">
            <animateTransform attributeName="transform" type="rotate"
              from="0 130 130" to="-360 130 130" dur="55s" repeatCount="indefinite" />
          </circle>
          {/* Inner ring CW 32s */}
          <circle cx="130" cy="130" r="96" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="1 5">
            <animateTransform attributeName="transform" type="rotate"
              from="0 130 130" to="360 130 130" dur="32s" repeatCount="indefinite" />
          </circle>

          {/* ── Chaîne de montagnes lointaine ── */}
          <path fill="none" stroke="white" strokeWidth="0.5" opacity="0.45"
            d="M 30,180 L 50,148 L 68,162 L 84,130 L 100,150 L 116,120 L 132,140 L 148,118 L 164,138 L 180,122 L 196,142 L 210,128 L 230,148 L 230,180" />
          {/* Neige chaîne lointaine */}
          <path fill="none" stroke="white" strokeWidth="0.4" opacity="0.35"
            d="M 50,148 L 55,155 L 60,149 L 68,162 L 75,150 L 84,130 L 90,142 L 96,133 L 100,150 L 106,137 L 116,120 L 122,134 L 130,124 L 132,140 L 138,127 L 148,118 L 154,130 L 162,122 L 164,138 L 170,126 L 180,122 L 186,132 L 194,124 L 196,142 L 202,130 L 210,128 L 218,136 L 230,148" />

          {/* ── Chaîne principale ── */}
          <path fill="none" stroke="white" strokeWidth="1.7"
            d="M 22,210 C 40,186 56,156 74,128 L 94,150 C 106,132 118,108 130,72 C 142,108 154,132 166,150 L 186,128 C 204,156 220,186 238,210" />

          {/* Pics secondaires sur les côtés */}
          <path fill="none" stroke="white" strokeWidth="0.9"
            d="M 22,210 C 34,192 46,170 58,152 L 66,162" />
          <path fill="none" stroke="white" strokeWidth="0.9"
            d="M 238,210 C 226,192 214,170 202,152 L 194,162" />

          {/* Calotte neigeuse pic principal */}
          <path fill="none" stroke="white" strokeWidth="1.1"
            d="M 112,88 C 120,78 126,72 130,72 C 134,72 140,78 148,88" />

          {/* Névé pics secondaires */}
          <path fill="none" stroke="white" strokeWidth="0.6"
            d="M 70,128 C 72,120 76,116 74,128" />
          <path fill="none" stroke="white" strokeWidth="0.6"
            d="M 186,128 C 184,116 188,120 190,128" />

          {/* ── Pistes de ski ── */}
          <path fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="3.5 4"
            d="M 124,80 C 108,104 88,138 76,180" />
          <path fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="3.5 4"
            d="M 130,72 C 128,110 128,150 126,192" />
          <path fill="none" stroke="white" strokeWidth="0.8" strokeDasharray="3.5 4"
            d="M 136,80 C 152,106 172,140 184,180" />
          {/* Piste versant gauche */}
          <path fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="2.5 4"
            d="M 74,132 C 62,148 50,168 40,192" />
          {/* Piste versant droit */}
          <path fill="none" stroke="white" strokeWidth="0.6" strokeDasharray="2.5 4"
            d="M 186,132 C 198,148 210,168 220,192" />

          {/* ── Téléphérique ── */}
          <line x1="100" y1="206" x2="130" y2="76" fill="none" stroke="white" strokeWidth="0.7" />
          <line x1="160" y1="206" x2="130" y2="76" fill="none" stroke="white" strokeWidth="0.55" />

          {/* Gondole — monte et descend */}
          <g>
            <animateTransform
              attributeName="transform" type="translate"
              values="0 0; 30 -130; 30 -130; 0 0; 0 0"
              keyTimes="0; 0.42; 0.54; 0.96; 1"
              dur="10s" repeatCount="indefinite"
              calcMode="spline"
              keySplines="0.42 0 0.18 1;0 0 1 1;0.82 0.18 0.58 1;0 0 1 1" />
            <rect x="95" y="200" width="10" height="8" rx="1.5" fill="none" stroke="white" strokeWidth="1.0" />
            <line x1="100" y1="196" x2="100" y2="200" stroke="white" strokeWidth="0.7" />
            <line x1="97" y1="203" x2="100" y2="203" stroke="white" strokeWidth="0.5" />
            <line x1="102" y1="203" x2="104" y2="203" stroke="white" strokeWidth="0.5" />
          </g>

          {/* Station bas (chalet alpin) */}
          <rect x="88" y="208" width="24" height="12" fill="none" stroke="white" strokeWidth="0.8" />
          <path fill="none" stroke="white" strokeWidth="0.9" d="M 86,208 L 100,198 L 114,208" />
          <rect x="106" y="198" width="4" height="6" fill="none" stroke="white" strokeWidth="0.6" />
          {/* 2e chalet */}
          <rect x="148" y="210" width="20" height="10" fill="none" stroke="white" strokeWidth="0.7" />
          <path fill="none" stroke="white" strokeWidth="0.8" d="M 146,210 L 158,202 L 170,210" />

          {/* Sapins */}
          {[40,56,200,216].map(x => (
            <g key={x}>
              <line x1={x} y1="200" x2={x} y2="205" stroke="white" strokeWidth="0.7" />
              <path fill="none" stroke="white" strokeWidth="0.6"
                d={`M${x},200 L${x-6},210 L${x+6},210 Z`} />
              <path fill="none" stroke="white" strokeWidth="0.6"
                d={`M${x},193 L${x-4},203 L${x+4},203 Z`} />
            </g>
          ))}

          {/* Étoile au sommet */}
          <g transform="translate(130 56)">
            <polygon fill="white"
              points="0,-8 1.9,-4 5.8,-5.8 4,-1.9 8,0 4,1.9 5.8,5.8 1.9,4 0,8 -1.9,4 -5.8,5.8 -4,1.9 -8,0 -4,-1.9 -5.8,-5.8 -1.9,-4">
              <animateTransform attributeName="transform" type="scale"
                values="1;1.5;1" dur="2.2s" repeatCount="indefinite"
                calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
              <animate attributeName="fill-opacity" values="0.9;0.3;0.9" dur="2.2s"
                repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.6 1;0.4 0 0.6 1" />
            </polygon>
          </g>

          <text fill="white" fontSize="6.5" fontFamily="Georgia, 'Times New Roman', serif"
            letterSpacing="2.2" opacity="0.7" textAnchor="middle">
            <textPath href="#rs-bot" startOffset="50%">
              · RISOUL 1850 · HAUTES-ALPES · ALPES DU SUD ·
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
