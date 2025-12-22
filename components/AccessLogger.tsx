'use client';

import { useEffect, useRef } from 'react';

/**
 * Componente para registrar o acesso ao site
 * Executa apenas uma vez quando o usuário visita o site
 */
export function AccessLogger() {
  const hasLogged = useRef(false);

  useEffect(() => {
    if (hasLogged.current) return;
    hasLogged.current = true;

    const logAccess = async () => {
      try {
        await fetch('/api/log-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Erro ao registrar acesso:', error);
      }
    };

    logAccess();
  }, []);

  return null;
}
