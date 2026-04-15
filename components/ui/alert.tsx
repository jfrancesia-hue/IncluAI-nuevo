import * as React from 'react';
import { cn } from '@/lib/utils';

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'error' | 'success' | 'info';
};

const styles: Record<NonNullable<AlertProps['variant']>, string> = {
  default: 'border-border bg-card text-foreground',
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-green-200 bg-accent-light text-accent',
  info: 'border-blue-200 bg-primary-bg text-primary',
};

export function Alert({ className, variant = 'default', ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-[10px] border px-4 py-3 text-sm',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
