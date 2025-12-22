const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface AccessLogPayload {
  ipAddress: string;
  userAgent: string;
}

/**
 * Registra um acesso ao portal
 * @param payload - Dados do acesso (IP e User Agent)
 */
export async function logPortalAccess(payload: AccessLogPayload): Promise<void> {
  try {
    const params = new URLSearchParams({
      ipAddress: payload.ipAddress,
      userAgent: payload.userAgent,
    });

    const response = await fetch(`${API_BASE_URL}/portal-access-log?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`Falha ao registrar acesso: ${response.status}`);
    }
  } catch (error) {
    console.error('Erro ao registrar acesso:', error);
  }
}
