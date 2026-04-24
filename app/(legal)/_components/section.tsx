import type { ReactNode } from 'react';

export function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">{title}</h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-[#1F2E3D]/90">
        {children}
      </div>
    </section>
  );
}
