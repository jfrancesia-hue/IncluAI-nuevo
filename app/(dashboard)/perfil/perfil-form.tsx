'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { PROVINCIAS_AR } from '@/data/provincias';
import type { Perfil } from '@/lib/types';
import { actualizarPerfil } from './actions';

export function PerfilForm({ perfil }: { perfil: Perfil }) {
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      action={(fd) => {
        setMsg(null);
        startTransition(async () => {
          const result = await actualizarPerfil(fd);
          if (result.ok) {
            setMsg({ kind: 'ok', text: 'Perfil actualizado.' });
          } else {
            setMsg({ kind: 'err', text: result.error });
          }
        });
      }}
      className="flex flex-col gap-4"
    >
      {msg?.kind === 'ok' && <Alert variant="success">{msg.text}</Alert>}
      {msg?.kind === 'err' && <Alert variant="error">{msg.text}</Alert>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nombre">
          <Input name="nombre" defaultValue={perfil.nombre} required />
        </Field>
        <Field label="Apellido">
          <Input name="apellido" defaultValue={perfil.apellido} required />
        </Field>
      </div>

      <Field label="Email">
        <Input value={perfil.email} disabled />
        <span className="text-xs text-muted">El email no se puede cambiar.</span>
      </Field>

      <Field label="Institución educativa">
        <Input name="institucion" defaultValue={perfil.institucion ?? ''} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Localidad">
          <Input name="localidad" defaultValue={perfil.localidad ?? ''} />
        </Field>
        <Field label="Provincia">
          <Select
            name="provincia"
            defaultValue={
              perfil.provincia && perfil.provincia !== 'No especificada'
                ? perfil.provincia
                : ''
            }
          >
            <option value="">Seleccionar…</option>
            {PROVINCIAS_AR.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <Button type="submit" disabled={isPending} className="self-start">
        {isPending ? 'Guardando…' : 'Guardar cambios'}
      </Button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
