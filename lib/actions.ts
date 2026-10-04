'use server';

import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { auth, signIn, signOut } from '@/auth';
import { isIsoDate } from './dates';
import type { LoginState } from './login-state';
import type { MeetingFormState, MeetingFormValues } from './meeting-form';
import * as meetingsDb from './meetings-db';
import type { MeetingType } from './types';

const MEETING_TYPES = ['testimony', 'regular', 'stake', 'general', 'special'] as const satisfies readonly MeetingType[];

function requiredText(label: string, max = 200) {
  return z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .max(max, `${label} must be ${max} characters or fewer.`);
}

function hymnNumber(label: string) {
  return z
    .string()
    .trim()
    // abort: an empty number shows only "required", not also "must be a whole number".
    .min(1, { error: `${label} number is required.`, abort: true })
    .regex(/^\d+$/, `${label} number must be a whole number.`)
    .transform(Number)
    .pipe(z.number().min(1, `${label} number must be 1 or greater.`).max(9999, `${label} number must be 9999 or less.`));
}

/** Splits a textarea into its non-blank lines. */
function lines(label: string, max: number) {
  return z
    .string()
    .transform((value) =>
      value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    )
    .pipe(
      z
        .array(z.string().max(300, `Each ${label} must be 300 characters or fewer.`))
        .max(max, `Enter at most ${max} ${label}s.`),
    );
}

const MeetingFormSchema = z.object({
  date: z.string().refine(isIsoDate, 'Enter a valid meeting date.'),
  meetingType: z.enum(MEETING_TYPES, { error: 'Choose a meeting type.' }),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  announcements: lines('announcement', 20),
  openingHymnNumber: hymnNumber('Opening hymn'),
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Invocation'),
  wardBusiness: lines('business item', 20),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumber('Sacrament hymn'),
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  speakers: z
    .array(
      z.object({
        name: requiredText('Name'),
        topic: z.string().trim().max(200, 'Topic must be 200 characters or fewer.'),
        type: z.enum(['speaker', 'musical-number'], { error: 'Choose speaker or musical number.' }),
      }),
    )
    .max(15, 'Add at most 15 speakers and musical numbers.'),
  closingHymnNumber: hymnNumber('Closing hymn'),
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Benediction'),
});

function text(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

/** Reads the raw form fields; speaker rows arrive as parallel repeated fields. */
function readFormValues(formData: FormData): MeetingFormValues {
  const all = (name: string) => formData.getAll(name).map((value) => (typeof value === 'string' ? value : ''));
  const names = all('speakerName');
  const topics = all('speakerTopic');
  const types = all('speakerType');

  return {
    date: text(formData, 'date'),
    meetingType: text(formData, 'meetingType'),
    presiding: text(formData, 'presiding'),
    conducting: text(formData, 'conducting'),
    announcements: text(formData, 'announcements'),
    openingHymnNumber: text(formData, 'openingHymnNumber'),
    openingHymnTitle: text(formData, 'openingHymnTitle'),
    openingPrayer: text(formData, 'openingPrayer'),
    wardBusiness: text(formData, 'wardBusiness'),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
    sacramentHymnNumber: text(formData, 'sacramentHymnNumber'),
    sacramentHymnTitle: text(formData, 'sacramentHymnTitle'),
    speakers: names.map((name, index) => ({
      name,
      topic: topics[index] ?? '',
      type: types[index] ?? 'speaker',
    })),
    closingHymnNumber: text(formData, 'closingHymnNumber'),
    closingHymnTitle: text(formData, 'closingHymnTitle'),
    closingPrayer: text(formData, 'closingPrayer'),
  };
}

/**
 * Validates the submitted form. On failure returns the state to send back to
 * the form: field-level errors keyed by path ("date", "speakers.0.name").
 */
function validate(
  formData: FormData,
): { success: true; meeting: meetingsDb.MeetingInput } | { success: false; state: MeetingFormState } {
  const values = readFormValues(formData);
  const result = MeetingFormSchema.safeParse(values);

  if (!result.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join('.');
      (errors[key] ??= []).push(issue.message);
    }
    return {
      success: false,
      state: { message: 'Some fields are missing or invalid. Fix the errors below and try again.', errors, values },
    };
  }

  const data = result.data;
  return {
    success: true,
    meeting: {
      date: data.date,
      meetingType: data.meetingType,
      presiding: data.presiding,
      conducting: data.conducting,
      announcements: data.announcements,
      openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
      openingPrayer: data.openingPrayer,
      wardBusiness: data.wardBusiness.map((description) => ({ description })),
      stakeBusiness: data.stakeBusiness,
      sacramentHymn: { number: data.sacramentHymnNumber, title: data.sacramentHymnTitle },
      speakers: data.speakers,
      closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
      closingPrayer: data.closingPrayer,
    },
  };
}

/** Bound ids come from the client, so check them like any other input. */
/**
 * Mutations change ward data, so each one checks for a signed-in bishopric
 * member itself: proxy.ts only guards the pages, not the actions behind them.
 */
async function requireSession() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return session;
}

function checkId(id: number): number {
  const parsed = meetingsDb.parseMeetingId(String(id));
  if (parsed === null) throw new Error('Invalid meeting id.');
  return parsed;
}

export async function createMeeting(_prevState: MeetingFormState, formData: FormData): Promise<MeetingFormState> {
  await requireSession();
  const validated = validate(formData);
  if (!validated.success) return validated.state;

  try {
    await meetingsDb.addMeeting(validated.meeting);
  } catch (error) {
    console.error('Failed to create meeting:', error);
    throw new Error('Database error: the meeting could not be created. Please try again.');
  }

  // Outside the try: redirect() works by throwing, and must not be caught above.
  revalidatePath('/meetings');
  redirect('/meetings');
}

export async function updateMeeting(
  id: number,
  _prevState: MeetingFormState,
  formData: FormData,
): Promise<MeetingFormState> {
  await requireSession();
  const meetingId = checkId(id);
  const validated = validate(formData);
  if (!validated.success) return validated.state;

  let updated;
  try {
    updated = await meetingsDb.updateMeeting(meetingId, validated.meeting);
  } catch (error) {
    console.error(`Failed to update meeting ${meetingId}:`, error);
    throw new Error('Database error: the meeting could not be updated. Please try again.');
  }

  if (!updated) {
    return {
      message: 'This meeting no longer exists. It may have been deleted by someone else.',
      errors: {},
      values: readFormValues(formData),
    };
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${meetingId}`);
  redirect('/meetings');
}

export async function deleteMeeting(id: number): Promise<void> {
  await requireSession();
  const meetingId = checkId(id);

  try {
    await meetingsDb.deleteMeeting(meetingId);
  } catch (error) {
    console.error(`Failed to delete meeting ${meetingId}:`, error);
    throw new Error('Database error: the meeting could not be deleted. Please try again.');
  }

  // No redirect: deleting from the list keeps the current search and page.
  revalidatePath('/meetings');
}

/** Only same-site paths, so the login form can't be used to send people to another site. */
function safeRedirectPath(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/meetings';
  return value;
}

/** Login form action: redirects on success, or returns an error and the email to refill the form with. */
export async function authenticate(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = typeof formData.get('email') === 'string' ? (formData.get('email') as string) : '';
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: safeRedirectPath(formData.get('redirectTo')),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      const message =
        error.type === 'CredentialsSignin' ? 'Invalid email or password.' : 'Something went wrong. Please try again.';
      return { message, email };
    }
    // A successful sign-in redirects by throwing; let Next.js handle it.
    throw error;
  }
  return {};
}

export async function signOutAction(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
