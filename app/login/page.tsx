import type { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';

export const metadata: Metadata = {
  title: 'Bishopric Sign In',
  description: 'Sign in to plan, edit, and delete sacrament meeting programs.',
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { callbackUrl } = await searchParams;
  // Auth.js passes the protected page as an absolute URL; keep only its path.
  let redirectTo = '/meetings';
  if (typeof callbackUrl === 'string') {
    try {
      const url = new URL(callbackUrl, 'http://localhost');
      redirectTo = `${url.pathname}${url.search}`;
    } catch {
      // Malformed callbackUrl: fall back to the meetings list.
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">Bishopric Sign In</h1>
        <p className="mt-2 text-muted">Sign in to create, edit, or delete meeting programs.</p>
      </div>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}
