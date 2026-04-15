import 'server-only';
import { createClient } from '@supabase/supabase-js';

// Cliente con service_role. Úsalo SOLO en endpoints del servidor que no
// tengan sesión de usuario (webhooks). Nunca lo importes desde un Server
// Component ni desde el cliente.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
