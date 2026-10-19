'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function BookingCalculator({
  pricePerNight,
  cleaningFee,
  minNights,
}: {
  pricePerNight: number;
  cleaningFee?: number;
  minNights?: number;
}) {
  const t = useTranslations('booking');
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
        <span>🧮</span> {t('title')}
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-[#9B8A74] font-medium block mb-1">{t('checkin')}</label>
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
          <label className="text-xs text-[#9B8A74] font-medium block mb-1">{t('checkout')}</label>
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
              ⚠️ {t('min_stay_warning', { nights: minNights })}
            </p>
          ) : (
            <>
              <div className="flex justify-between text-[#5C4F3A]">
                <span>{pricePerNight}€ × {nights} {nights > 1 ? t('nights_label') : t('night')}</span>
                <span>{pricePerNight * nights}€</span>
              </div>
              {cleaningFee && (
                <div className="flex justify-between text-[#5C4F3A]">
                  <span>{t('cleaning_fee')}</span>
                  <span>{cleaningFee}€</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-[#2C2416] border-t border-[#E8DCC8] pt-2 mt-2">
                <span>{t('estimated_total')}</span>
                <span className="text-[#C8763A] text-lg">{total}€</span>
              </div>
              <p className="text-[#9B8A74] text-xs">{t('disclaimer')}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
