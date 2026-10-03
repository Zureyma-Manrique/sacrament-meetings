import { signOutAction } from '@/lib/actions';

export default function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="focus-ring rounded-md border border-primary-foreground/60 px-3 py-1 text-sm font-medium hover:bg-primary-foreground/10"
      >
        Sign out
      </button>
    </form>
  );
}
