export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-b border-border pb-4 print:hidden">
        <p className="font-heading text-sm font-semibold uppercase tracking-wide text-muted">
          Bishopric Admin
        </p>
      </div>
      {children}
    </div>
  );
}
