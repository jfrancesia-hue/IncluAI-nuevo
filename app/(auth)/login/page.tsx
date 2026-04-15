import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './login-form';

export const metadata = {
  title: 'Iniciá sesión · IncluIA',
};

export default function LoginPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Iniciá sesión</CardTitle>
        <CardDescription>
          Accedé a tu cuenta para generar guías inclusivas personalizadas.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense>
          <LoginForm />
        </Suspense>
      </CardContent>
    </Card>
  );
}
