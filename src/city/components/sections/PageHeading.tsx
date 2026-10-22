import type { ReactNode } from 'react';

/** A page's main heading; it takes focus when the page opens. */
export function PageHeading({ className, children }: { className: string; children: ReactNode }) {
  return (
    <h1 className={className} tabIndex={-1} data-page-heading>
      {children}
    </h1>
  );
}
