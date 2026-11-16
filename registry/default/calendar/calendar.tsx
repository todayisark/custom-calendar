'use client';

import * as React from 'react';

type WeekStartsOn = 0 | 1;

export type CalendarDay = {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

export type CalendarRenderDayProps = CalendarDay;

export type CalendarRenderWeekdayProps = {
  day: number;
  index: number;
  label: string;
};

export type CalendarRenderHeaderProps = {
  month: Date;
  label: string;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
};

export type CalendarClassNames = Partial<{
  root: string;
  header: string;
  monthLabel: string;
  navigation: string;
  previousButton: string;
  nextButton: string;
  weekdays: string;
  weekday: string;
  grid: string;
  day: string;
  dayOutside: string;
  dayToday: string;
}>;

export type CalendarProps = Omit<React.ComponentProps<'div'>, 'onChange'> & {
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  onDayClick?: (day: CalendarDay) => void;
  locale?: string;
  weekStartsOn?: WeekStartsOn;
  classNames?: CalendarClassNames;
  renderHeader?: (props: CalendarRenderHeaderProps) => React.ReactNode;
  renderWeekday?: (props: CalendarRenderWeekdayProps) => React.ReactNode;
  renderDay?: (props: CalendarRenderDayProps) => React.ReactNode;
};

const cn = (...values: Array<string | false | null | undefined>) => {
  return values.filter(Boolean).join(' ');
};

const startOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const addMonths = (date: Date, amount: number) => {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
};

const isSameDay = (left: Date, right: Date) => {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCalendarDays = (month: Date, weekStartsOn: WeekStartsOn): CalendarDay[] => {
  const firstDay = startOfMonth(month);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const leadingDays = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const trailingDays = (weekStartsOn + 6 - lastDay.getDay() + 7) % 7;
  const totalDays = leadingDays + lastDay.getDate() + trailingDays;
  const gridStart = new Date(month.getFullYear(), month.getMonth(), 1 - leadingDays);
  const today = new Date();

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    );

    return {
      date,
      dateKey: toDateKey(date),
      isCurrentMonth:
        date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth(),
      isToday: isSameDay(date, today),
    };
  });
};

const getWeekdays = (locale: string | undefined, weekStartsOn: WeekStartsOn) => {
  const formatter = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const sunday = new Date(2024, 0, 7);

  return Array.from({ length: 7 }, (_, index) => {
    const day = (weekStartsOn + index) % 7;
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + day);
    return { day, label: formatter.format(date) };
  });
};

export const Calendar = ({
  month: controlledMonth,
  defaultMonth,
  onMonthChange,
  onDayClick,
  locale,
  weekStartsOn = 0,
  className,
  classNames,
  renderHeader,
  renderWeekday,
  renderDay,
  ...props
}: CalendarProps) => {
  const [internalMonth, setInternalMonth] = React.useState(() =>
    startOfMonth(defaultMonth ?? new Date()),
  );
  const requestedMonth = controlledMonth ?? internalMonth;
  const displayedYear = requestedMonth.getFullYear();
  const displayedMonth = requestedMonth.getMonth();
  const month = React.useMemo(
    () => new Date(displayedYear, displayedMonth, 1),
    [displayedYear, displayedMonth],
  );
  const days = React.useMemo(() => getCalendarDays(month, weekStartsOn), [month, weekStartsOn]);
  const weekdays = React.useMemo(() => getWeekdays(locale, weekStartsOn), [locale, weekStartsOn]);
  const monthLabel = React.useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(month),
    [locale, month],
  );

  const setMonth = React.useCallback(
    (nextMonth: Date) => {
      const normalized = startOfMonth(nextMonth);
      if (controlledMonth === undefined) setInternalMonth(normalized);
      onMonthChange?.(normalized);
    },
    [controlledMonth, onMonthChange],
  );

  const goToPreviousMonth = React.useCallback(
    () => setMonth(addMonths(month, -1)),
    [month, setMonth],
  );
  const goToNextMonth = React.useCallback(() => setMonth(addMonths(month, 1)), [month, setMonth]);
  const headerProps = {
    month,
    label: monthLabel,
    goToPreviousMonth,
    goToNextMonth,
  };

  return (
    <div className={cn('w-full', classNames?.root, className)} {...props}>
      {renderHeader ? (
        renderHeader(headerProps)
      ) : (
        <div className={cn('flex items-center justify-between gap-2', classNames?.header)}>
          <div className={cn('font-medium', classNames?.monthLabel)} aria-live='polite'>
            {monthLabel}
          </div>
          <div className={cn('flex items-center gap-1', classNames?.navigation)}>
            <button
              type='button'
              className={cn(
                'inline-flex size-8 items-center justify-center',
                classNames?.previousButton,
              )}
              onClick={goToPreviousMonth}
              aria-label='Previous month'
            >
              <span aria-hidden='true'>‹</span>
            </button>
            <button
              type='button'
              className={cn(
                'inline-flex size-8 items-center justify-center',
                classNames?.nextButton,
              )}
              onClick={goToNextMonth}
              aria-label='Next month'
            >
              <span aria-hidden='true'>›</span>
            </button>
          </div>
        </div>
      )}

      <div className={cn('mt-3 grid grid-cols-7', classNames?.weekdays)} role='row'>
        {weekdays.map((weekday, index) => (
          <div
            key={weekday.day}
            className={cn('text-center text-sm', classNames?.weekday)}
            role='columnheader'
          >
            {renderWeekday?.({ ...weekday, index }) ?? weekday.label}
          </div>
        ))}
      </div>

      <div className={cn('grid grid-cols-7', classNames?.grid)} role='grid' aria-label={monthLabel}>
        {days.map((day) => (
          <button
            key={day.dateKey}
            type='button'
            className={cn(
              'min-w-0 text-left',
              classNames?.day,
              !day.isCurrentMonth && classNames?.dayOutside,
              day.isToday && classNames?.dayToday,
            )}
            onClick={() => onDayClick?.(day)}
            role='gridcell'
            aria-label={new Intl.DateTimeFormat(locale, {
              dateStyle: 'full',
            }).format(day.date)}
            aria-current={day.isToday ? 'date' : undefined}
            data-date={day.dateKey}
            data-outside={!day.isCurrentMonth || undefined}
            data-today={day.isToday || undefined}
          >
            {renderDay?.(day) ?? day.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
};
