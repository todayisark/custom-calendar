# Custom Calendar Registry

A minimal shadcn Registry component for building content-first monthly calendars. It is not a date picker: every visible region can be replaced, and `renderDay` can render arbitrary React content inside each day cell.

## Install from GitHub

After publishing this repository publicly:

```bash
pnpm dlx shadcn@latest add <github-user>/custom-calendar/calendar
```

For local development, build and serve the generated Registry JSON, then install by URL:

```bash
pnpm install
pnpm build
pnpm dlx serve public
pnpm dlx shadcn@latest add http://localhost:3000/r/calendar.json
```

## Usage

```tsx
import { Calendar } from '@/components/ui/calendar';

export function DiaryCalendar() {
  return (
    <Calendar
      locale='zh-CN'
      weekStartsOn={0}
      classNames={{
        day: 'min-h-24 border p-2',
        dayOutside: 'opacity-30',
        dayToday: 'ring-2 ring-primary',
      }}
      renderDay={({ date, dateKey, isCurrentMonth, isToday }) => (
        <article>
          <time dateTime={dateKey}>{date.getDate()}</time>
          {isCurrentMonth && <YourContent date={date} />}
          {isToday && <span>Today</span>}
        </article>
      )}
      onDayClick={({ date, dateKey }) => {
        console.log(date, dateKey);
      }}
    />
  );
}
```

## API

- `month` / `onMonthChange`: controlled visible month.
- `defaultMonth`: initial month for uncontrolled usage.
- `locale`: locale passed to `Intl.DateTimeFormat`.
- `weekStartsOn`: `0` for Sunday (default), `1` for Monday.
- `renderHeader`: replaces the complete month header.
- `renderWeekday`: replaces each weekday label.
- `renderDay`: replaces the content inside each day button.
- `onDayClick`: receives the clicked `CalendarDay`; selection state belongs to the consumer.
- `classNames`: classes for individual structural parts.

The grid has as many complete weeks as the displayed month requires, so it naturally switches between five and six rows.
