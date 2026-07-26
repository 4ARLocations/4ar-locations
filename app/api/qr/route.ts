import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET() {
  const png = await QRCode.toBuffer('https://www.4arlocations.com', {
    width: 200,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#2C2416', light: '#FFF8F0' },
  });
  return new NextResponse(png as unknown as BodyInit, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
