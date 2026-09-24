import Image from 'next/image';
import Link from 'next/link';
import { WARD_NAME } from '@/lib/site';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Sacrament Meeting Planner</h1>
        <p className="max-w-2xl text-lg text-muted">
          View, prepare, and print sacrament meeting programs for the {WARD_NAME}: hymns, prayers,
          speakers, musical numbers, announcements, and ward business in one place.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/meetings/current" className="btn">
            View this Sunday&rsquo;s program
          </Link>
          <Link href="/meetings" className="btn-secondary">
            Browse all programs
          </Link>
        </div>
      </section>

      <Image
        src="/hero-chapel.svg"
        alt="Illustration of a white chapel with a steeple on a green hillside under a clear sky"
        width={1200}
        height={500}
        preload
        className="h-auto w-full rounded-lg border border-border"
      />

      <section aria-labelledby="features-heading" className="flex flex-col gap-4">
        <h2 id="features-heading" className="font-heading text-2xl font-semibold">
          What you can do
        </h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="card">
            <h3 className="font-heading font-semibold">See this week&rsquo;s program</h3>
            <p className="mt-2 text-sm text-muted">
              Jump straight to the most recent Sunday&rsquo;s agenda.
            </p>
          </li>
          <li className="card">
            <h3 className="font-heading font-semibold">Review past meetings</h3>
            <p className="mt-2 text-sm text-muted">Browse or filter earlier programs by date.</p>
          </li>
          <li className="card">
            <h3 className="font-heading font-semibold">Print a clean copy</h3>
            <p className="mt-2 text-sm text-muted">
              Print-friendly layouts for the pulpit or the bulletin board.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
