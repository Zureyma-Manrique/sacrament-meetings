'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react';
import { MEETING_TYPE_LABELS } from '@/lib/meeting-labels';
import {
  EMPTY_MEETING_FORM_VALUES,
  EMPTY_SPEAKER,
  initialMeetingFormState,
  type MeetingFormState,
  type MeetingFormValues,
} from '@/lib/meeting-form';
import type { MeetingType } from '@/lib/types';

interface MeetingFormProps {
  /** Server Action the form submits to (updateMeeting is pre-bound to the meeting id). */
  action: (prevState: MeetingFormState, formData: FormData) => Promise<MeetingFormState>;
  /** Starting values; omitted for a new meeting. */
  defaultValues?: MeetingFormValues;
  submitLabel: string;
  pendingLabel: string;
}

type SpeakerRow = MeetingFormValues['speakers'][number] & { key: number };

let nextRowKey = 0;
function toRows(speakers: MeetingFormValues['speakers']): SpeakerRow[] {
  return speakers.map((speaker) => ({ ...speaker, key: nextRowKey++ }));
}

/** Error container below a field. Always rendered so aria-live announces errors as they appear. */
function FieldErrors({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true" className="text-sm text-danger">
      {errors?.map((error) => (
        <p key={error} className="mt-1">
          {error}
        </p>
      ))}
    </div>
  );
}

interface FieldProps {
  id: string;
  label: string;
  errors?: string[];
  hint?: string;
  className?: string;
  /** Renders the control, given the props that connect it to its label, hint, and errors. */
  children: (control: {
    id: string;
    'aria-describedby': string;
    'aria-invalid': boolean;
  }) => ReactNode;
}

function Field({ id, label, errors, hint, className = '', children }: FieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {children({
        id,
        'aria-describedby': hint ? `${hintId} ${errorId}` : errorId,
        'aria-invalid': Boolean(errors?.length),
      })}
      <FieldErrors id={errorId} errors={errors} />
    </div>
  );
}

function HymnFields({
  prefix,
  legend,
  values,
  errors,
}: {
  prefix: 'openingHymn' | 'sacramentHymn' | 'closingHymn';
  legend: string;
  values: MeetingFormValues;
  errors: Record<string, string[]>;
}) {
  const numberName = `${prefix}Number` as const;
  const titleName = `${prefix}Title` as const;
  return (
    <fieldset className="grid gap-3 sm:grid-cols-[8rem_1fr]">
      <legend className="mb-2 text-sm font-semibold">{legend}</legend>
      <Field id={numberName} label="Number" errors={errors[numberName]}>
        {(control) => (
          <input
            {...control}
            name={numberName}
            type="text"
            inputMode="numeric"
            defaultValue={values[numberName]}
            className="input"
            required
          />
        )}
      </Field>
      <Field id={titleName} label="Title" errors={errors[titleName]}>
        {(control) => (
          <input {...control} name={titleName} type="text" defaultValue={values[titleName]} className="input" required />
        )}
      </Field>
    </fieldset>
  );
}

export default function MeetingForm({ action, defaultValues, submitLabel, pendingLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialMeetingFormState);
  const values = state.values ?? defaultValues ?? EMPTY_MEETING_FORM_VALUES;
  const errors = state.errors;

  const [rows, setRows] = useState<SpeakerRow[]>(() => toRows(values.speakers));
  // After a failed submission, show the speaker rows exactly as they were submitted.
  const [shownState, setShownState] = useState(state);
  if (state !== shownState) {
    setShownState(state);
    if (state.values) setRows(toRows(state.values.speakers));
  }

  // Move focus to the summary so keyboard and screen reader users land on the errors.
  const summaryRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.message) summaryRef.current?.focus();
  }, [state]);

  const speakerSummary = errors.speakers;

  return (
    <form action={formAction} noValidate className="flex flex-col gap-6" aria-describedby="form-summary">
      <div
        id="form-summary"
        ref={summaryRef}
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
        className="focus-ring rounded-md"
      >
        {state.message && (
          <p className="rounded-md border border-danger bg-danger-soft px-4 py-3 text-sm text-danger">
            {state.message}
          </p>
        )}
      </div>

      <section aria-labelledby="details-heading" className="card flex flex-col gap-4">
        <h2 id="details-heading" className="font-heading text-xl font-semibold">
          Meeting details
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="date" label="Date" errors={errors.date}>
            {(control) => (
              <input {...control} name="date" type="date" defaultValue={values.date} className="input" required />
            )}
          </Field>
          <Field id="meetingType" label="Meeting type" errors={errors.meetingType}>
            {(control) => (
              <select {...control} name="meetingType" defaultValue={values.meetingType} className="input" required>
                {(Object.keys(MEETING_TYPE_LABELS) as MeetingType[]).map((type) => (
                  <option key={type} value={type}>
                    {MEETING_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            )}
          </Field>
          <Field id="presiding" label="Presiding" errors={errors.presiding}>
            {(control) => (
              <input {...control} name="presiding" type="text" defaultValue={values.presiding} className="input" required />
            )}
          </Field>
          <Field id="conducting" label="Conducting" errors={errors.conducting}>
            {(control) => (
              <input {...control} name="conducting" type="text" defaultValue={values.conducting} className="input" required />
            )}
          </Field>
        </div>
        <Field id="announcements" label="Announcements" hint="Optional. One announcement per line." errors={errors.announcements}>
          {(control) => (
            <textarea {...control} name="announcements" rows={3} defaultValue={values.announcements} className="input" />
          )}
        </Field>
      </section>

      <section aria-labelledby="opening-heading" className="card flex flex-col gap-4">
        <h2 id="opening-heading" className="font-heading text-xl font-semibold">
          Opening and business
        </h2>
        <HymnFields prefix="openingHymn" legend="Opening hymn" values={values} errors={errors} />
        <Field id="openingPrayer" label="Invocation" errors={errors.openingPrayer}>
          {(control) => (
            <input {...control} name="openingPrayer" type="text" defaultValue={values.openingPrayer} className="input" required />
          )}
        </Field>
        <Field id="wardBusiness" label="Ward business" hint="Optional. One item per line." errors={errors.wardBusiness}>
          {(control) => (
            <textarea {...control} name="wardBusiness" rows={3} defaultValue={values.wardBusiness} className="input" />
          )}
        </Field>
        <div className="flex items-center gap-2">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            defaultChecked={values.stakeBusiness}
            className="focus-ring h-4 w-4 accent-primary"
          />
          <label htmlFor="stakeBusiness" className="text-sm font-medium">
            Stake business will be presented
          </label>
        </div>
        <HymnFields prefix="sacramentHymn" legend="Sacrament hymn" values={values} errors={errors} />
      </section>

      <section aria-labelledby="speakers-heading" className="card flex flex-col gap-4">
        <h2 id="speakers-heading" className="font-heading text-xl font-semibold">
          Speakers and music
        </h2>
        <p className="text-sm text-muted">
          In program order. Leave empty for a fast and testimony meeting.
        </p>
        {rows.length === 0 && <p className="text-sm text-muted">No speakers or musical numbers yet.</p>}
        <ol className="flex flex-col gap-4">
          {rows.map((row, index) => {
            const base = `speakers-${index}`;
            const itemLabel = `Program item ${index + 1}`;
            return (
              <li key={row.key}>
                <fieldset className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-[12rem_1fr_1fr]">
                  <legend className="px-1 text-sm font-semibold">{itemLabel}</legend>
                  <Field id={`${base}-type`} label="Type" errors={errors[`speakers.${index}.type`]}>
                    {(control) => (
                      <select {...control} name="speakerType" defaultValue={row.type} className="input">
                        <option value="speaker">Speaker</option>
                        <option value="musical-number">Musical number</option>
                      </select>
                    )}
                  </Field>
                  <Field id={`${base}-name`} label="Name" errors={errors[`speakers.${index}.name`]}>
                    {(control) => (
                      <input {...control} name="speakerName" type="text" defaultValue={row.name} className="input" required />
                    )}
                  </Field>
                  <Field id={`${base}-topic`} label="Topic or song" errors={errors[`speakers.${index}.topic`]}>
                    {(control) => (
                      <input {...control} name="speakerTopic" type="text" defaultValue={row.topic} className="input" />
                    )}
                  </Field>
                  <button
                    type="button"
                    onClick={() => setRows((current) => current.filter((item) => item.key !== row.key))}
                    className="btn-secondary justify-self-start sm:col-span-3"
                  >
                    Remove <span className="sr-only">{itemLabel.toLowerCase()}</span>
                  </button>
                </fieldset>
              </li>
            );
          })}
        </ol>
        <FieldErrors id="speakers-error" errors={speakerSummary} />
        <button
          type="button"
          onClick={() => setRows((current) => [...current, ...toRows([EMPTY_SPEAKER])])}
          className="btn-secondary self-start"
          aria-describedby="speakers-error"
        >
          Add speaker or musical number
        </button>
      </section>

      <section aria-labelledby="closing-heading" className="card flex flex-col gap-4">
        <h2 id="closing-heading" className="font-heading text-xl font-semibold">
          Closing
        </h2>
        <HymnFields prefix="closingHymn" legend="Closing hymn" values={values} errors={errors} />
        <Field id="closingPrayer" label="Benediction" errors={errors.closingPrayer}>
          {(control) => (
            <input {...control} name="closingPrayer" type="text" defaultValue={values.closingPrayer} className="input" required />
          )}
        </Field>
      </section>

      <div className="flex flex-wrap gap-3">
        <button type="submit" className="btn disabled:opacity-60" disabled={isPending} aria-disabled={isPending}>
          {isPending ? pendingLabel : submitLabel}
        </button>
        <Link href="/meetings" className="btn-secondary">
          Cancel
        </Link>
      </div>
    </form>
  );
}
