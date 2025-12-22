import { NextRequest, NextResponse } from 'next/server';
import { logPortalAccess } from '@/lib/services/access-log.service';

/**
 * API Route para registrar acessos ao portal
 * Captura o IP e User Agent do cliente e envia para a API externa
 */
export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    const xClientIp = request.headers.get('x-client-ip');
    
    let ipAddress: string = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || xClientIp || 'unknown';
    
    if (ipAddress === '::1' || ipAddress.includes('127.0.0.1') || ipAddress === 'unknown') {
      try {
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        ipAddress = ipData.ip || 'localhost';
      } catch {
        ipAddress = 'localhost';
      }
    }

    const userAgent = request.headers.get('user-agent') || 'unknown';

    await logPortalAccess({
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao processar log de acesso:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
