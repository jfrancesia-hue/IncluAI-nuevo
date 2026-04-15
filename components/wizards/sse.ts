// Cliente SSE: consume /api/generar-guia-* y dispara callbacks.
// Se comparte entre los wizards de los 3 módulos.

export type SSEHandlers = {
  onDelta: (text: string) => void;
  onDone: (consultaId: string, tokens?: number) => void;
  onError: (message: string) => void;
};

export async function consumirSSE(
  response: Response,
  handlers: SSEHandlers
): Promise<void> {
  if (!response.body) {
    handlers.onError('Respuesta sin body');
    return;
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let stopped = false;

  while (!stopped) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split('\n\n');
    buffer = events.pop() ?? '';
    for (const raw of events) {
      const parsed = parseEvent(raw);
      if (!parsed) continue;
      if (parsed.event === 'delta' && typeof parsed.data.text === 'string') {
        handlers.onDelta(parsed.data.text);
      } else if (parsed.event === 'done') {
        const id =
          typeof parsed.data.consulta_id === 'string' ? parsed.data.consulta_id : '';
        const tokens =
          typeof parsed.data.tokens === 'number' ? parsed.data.tokens : undefined;
        if (id) handlers.onDone(id, tokens);
      } else if (parsed.event === 'error') {
        const msg =
          typeof parsed.data.message === 'string'
            ? parsed.data.message
            : 'Error en streaming';
        handlers.onError(msg);
        stopped = true;
        await reader.cancel().catch(() => undefined);
        break;
      }
    }
  }
}

function parseEvent(raw: string): { event: string; data: Record<string, unknown> } | null {
  const lines = raw.split('\n').filter(Boolean);
  let event = 'message';
  let dataLine = '';
  for (const line of lines) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLine = line.slice(5).trim();
  }
  if (!dataLine) return null;
  try {
    return { event, data: JSON.parse(dataLine) as Record<string, unknown> };
  } catch {
    return null;
  }
}
