import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export const metadata = {
  title: 'Verificá tu email · IncluAI',
};

export default function VerificarEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revisá tu email 📬</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm text-muted">
        <p>
          Te enviamos un correo con un link para confirmar tu cuenta. Hacé clic
          en el link y te vamos a llevar al inicio.
        </p>
        <p>
          ¿No lo ves? Revisá la carpeta de <strong>Spam</strong> o{' '}
          <strong>Promociones</strong>.
        </p>
        <Link
          href="/login"
          className="mt-2 text-center font-medium text-accent hover:underline"
        >
          Volver al login
        </Link>
      </CardContent>
    </Card>
  );
}
