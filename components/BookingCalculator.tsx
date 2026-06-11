'use client';
import { useState } from 'react';

export default function BookingCalculator({
  pricePerNight,
  cleaningFee,
  minNights,
}: {
  pricePerNight: number;
  cleaningFee?: number;
  minNights?: number;
}) {
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');

  const today = new Date().toISOString().slice(0, 10);

  const nights =
    checkin && checkout
      ? Math.max(0, Math.round((new Date(checkout).getTime() - new Date(checkin).getTime()) / 86400000))
      : 0;

  const tooShort = minNights && nights > 0 && nights < minNights;
  const total = nights > 0 && !tooShort ? nights * pricePerNight + (cleaningFee ?? 0) : null;

  return (
    <div className="bg-[#FAF7F2] border border-[#E8DCC8] rounded-2xl p-5">
      <p className="text-sm font-semibold text-[#2C2416] mb-4 flex items-center gap-2">
        <span>🧮</span> Calculer le prix de votre séjour
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-[#9B8A74] font-medium block mb-1">Arrivée</label>
          <input
            type="date"
            value={checkin}
            min={today}
            onChange={(e) => {
              setCheckin(e.target.value);
              if (checkout && e.target.value >= checkout) setCheckout('');
            }}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm text-[#2C2416] bg-white focus:outline-none focus:border-[#C8763A] transition-colors"
          />
        </div>
        <div>
          <label className="text-xs text-[#9B8A74] font-medium block mb-1">Départ</label>
          <input
            type="date"
            value={checkout}
            min={checkin || today}
            onChange={(e) => setCheckout(e.target.value)}
            className="w-full border border-[#E8DCC8] rounded-lg px-3 py-2 text-sm text-[#2C2416] bg-white focus:outline-none focus:border-[#C8763A] transition-colors"
          />
        </div>
      </div>

      {nights > 0 && (
        <div className="space-y-2 text-sm border-t border-[#E8DCC8] pt-4">
          {tooShort ? (
            <p className="text-[#C8763A] text-xs font-medium">
              ⚠️ Durée minimum : {minNights} nuits pour ce logement.
            </p>
          ) : (
            <>
              <div className="flex justify-between text-[#5C4F3A]">
                <span>{pricePerNight}€ × {nights} nuit{nights > 1 ? 's' : ''}</span>
                <span>{pricePerNight * nights}€</span>
              </div>
              {cleaningFee && (
                <div className="flex justify-between text-[#5C4F3A]">
                  <span>Frais de ménage</span>
                  <span>{cleaningFee}€</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#2C2416] border-t border-[#E8DCC8] pt-2 mt-2">
                <span>Total estimé</span>
                <span className="text-[#C8763A] text-lg">{total}€</span>
              </div>
              <p className="text-[#9B8A74] text-xs">Hors taxes de séjour. Tarif indicatif.</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
