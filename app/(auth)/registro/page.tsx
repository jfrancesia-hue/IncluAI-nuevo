import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RegistroForm } from './registro-form';

export const metadata = {
  title: 'Creá tu cuenta · IncluIA',
};

export default function RegistroPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Creá tu cuenta gratuita</CardTitle>
        <CardDescription>2 guías inclusivas por mes, sin costo.</CardDescription>
      </CardHeader>
      <CardContent>
        <RegistroForm />
      </CardContent>
    </Card>
  );
}
