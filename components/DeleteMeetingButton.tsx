'use client';

import { useFormStatus } from 'react-dom';
import { deleteMeeting } from '@/lib/actions';

interface DeleteMeetingButtonProps {
  id: number;
  /** Human-readable meeting date, used in the confirmation and the button's accessible name. */
  label: string;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-danger disabled:opacity-60" disabled={pending} aria-disabled={pending}>
      {pending ? 'Deleting…' : 'Delete'}
      <span className="sr-only"> program for {label}</span>
    </button>
  );
}

export default function DeleteMeetingButton({ id, label }: DeleteMeetingButtonProps) {
  const deleteMeetingWithId = deleteMeeting.bind(null, id);

  return (
    <form
      action={deleteMeetingWithId}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the program for ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <SubmitButton label={label} />
    </form>
  );
}
