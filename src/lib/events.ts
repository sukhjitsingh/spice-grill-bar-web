import type { DatedEvent, EventsData, Occurrence, RecurringEvent } from '@/types/events';

const SITE = 'https://spicegrillbar66.com';
const DAY_MS = 86_400_000;
// Arizona does not observe DST, so the offset is constant year-round.
const AZ_OFFSET = '-07:00';

const noonUtc = (date: string) => new Date(`${date}T12:00:00Z`);
const dateKey = (d: Date) => d.toISOString().slice(0, 10);

export function todayInArizona(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Phoenix',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

export function expandRecurring(rule: RecurringEvent, fromDate: string, count: number): string[] {
  const anchor = noonUtc(rule.anchorDate).getTime();
  const step = rule.everyWeeks * 7 * DAY_MS;
  const first = Math.max(0, Math.ceil((noonUtc(fromDate).getTime() - anchor) / step));
  return Array.from({ length: count }, (_, i) => dateKey(new Date(anchor + (first + i) * step)));
}

export function upcomingDated(events: DatedEvent[], today: string): DatedEvent[] {
  return events
    .filter((e) => e.date >= today)
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function upcomingOccurrences(data: EventsData, today: string, perRecurring: number) {
  const recurring: Occurrence[] = data.recurring.flatMap((rule) =>
    expandRecurring(rule, today, perRecurring).map((date) => ({
      id: `${rule.id}-${date}`,
      title: rule.title,
      category: rule.category,
      date,
      time: rule.time,
      endTime: rule.endTime,
      endLabel: rule.endLabel,
      price: rule.price,
      description: rule.description,
      anchor: rule.id,
    }))
  );
  const dated: Occurrence[] = upcomingDated(data.events, today).map((e) => ({
    id: e.id,
    title: e.theme ? `${e.title}: ${e.theme}` : e.title,
    category: e.category,
    date: e.date,
    time: e.time,
    endTime: e.endTime,
    price: e.price,
    description: e.description,
    anchor: e.id,
  }));
  return [...recurring, ...dated].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
}

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return m === 0 ? `${h12} ${suffix}` : `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatTimeRange(time: string, endTime?: string, endLabel?: string): string {
  const end = endLabel ?? (endTime ? formatTime(endTime) : '');
  return end ? `${formatTime(time)} – ${end}` : formatTime(time);
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return noonUtc(date).toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
}

export function formatPrice(price?: number): string {
  if (price === undefined) return '';
  return price === 0 ? 'Free' : `$${price} per person`;
}

export function toIso(date: string, time: string): string {
  return `${date}T${time}:00${AZ_OFFSET}`;
}

export const eventUrl = (anchor: string) => `${SITE}/events/#${anchor}`;
