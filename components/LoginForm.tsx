'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, formAction, isPending] = useActionState(authenticate, {});

  return (
    <form action={formAction} className="card flex flex-col gap-4" aria-describedby="login-error">
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          defaultValue={state.email}
          required
          className="input"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          minLength={6}
          required
          className="input"
        />
      </div>
      <div id="login-error" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded-md border border-danger bg-danger-soft px-3 py-2 text-sm text-danger">
            {state.message}
          </p>
        )}
      </div>
      <button type="submit" className="btn disabled:opacity-60" disabled={isPending} aria-disabled={isPending}>
        {isPending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
