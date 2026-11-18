import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Calendar } from '../registry/default/calendar/calendar';
import eventImage from './assets/calendar-event.svg';

const baseClassNames = {
  root: 'max-w-4xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm',
  header: 'pb-2',
  monthLabel: 'text-lg font-semibold text-slate-900',
  previousButton: 'rounded-md border border-slate-200 hover:bg-slate-100',
  nextButton: 'rounded-md border border-slate-200 hover:bg-slate-100',
  weekdays: 'border-b border-slate-200 pb-2',
  weekday: 'font-medium text-slate-500',
  day: 'min-h-24 border-b border-r border-slate-100 p-2 hover:bg-blue-50',
  dayOutside: 'bg-slate-50 text-slate-400',
  dayToday: 'ring-2 ring-inset ring-blue-500',
} as const;

const meta = {
  title: 'Registry/Calendar',
  component: Calendar,
  args: {
    defaultMonth: new Date(2024, 4, 1),
    locale: 'en-US',
    classNames: baseClassNames,
  },
  parameters: {
    docs: {
      description: {
        component: 'A render-first monthly calendar. Stories import the Registry source directly.',
      },
    },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onDayClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('grid', { name: 'May 2024' })).toBeInTheDocument();
    await userEvent.click(canvas.getByRole('gridcell', { name: 'Wednesday, May 15, 2024' }));
    await expect(args.onDayClick).toHaveBeenCalledWith(
      expect.objectContaining({ dateKey: '2024-05-15', isCurrentMonth: true }),
    );
  },
};

export const Empty: Story = {};

export const CustomContent: Story = {
  args: {
    renderDay: ({ date, dateKey, isCurrentMonth }) => (
      <span className='flex h-full flex-col gap-1'>
        <time dateTime={dateKey} className='font-medium'>
          {date.getDate()}
        </time>
        {isCurrentMonth && date.getDate() === 15 && (
          <span className='rounded-md bg-blue-50 p-1 text-xs text-blue-900'>
            <img className='mb-1 w-full' src={eventImage} alt='Team planning' />
            Team planning
          </span>
        )}
      </span>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Team planning')).toBeInTheDocument();
    await expect(canvas.getByRole('img', { name: 'Team planning' })).toBeVisible();
  },
};

export const LongContent: Story = {
  args: {
    classNames: {
      ...baseClassNames,
      day: `${baseClassNames.day} h-28 overflow-hidden`,
    },
    renderDay: ({ date, dateKey, isCurrentMonth }) => (
      <span className='flex h-full min-w-0 flex-col gap-1 overflow-hidden'>
        <time dateTime={dateKey} className='shrink-0 font-medium'>
          {date.getDate()}
        </time>
        {isCurrentMonth && date.getDate() === 9 && (
          <span className='space-y-1 overflow-auto text-xs'>
            <span className='block rounded bg-amber-100 p-1'>Long quarterly planning session</span>
            <span className='block rounded bg-emerald-100 p-1'>Prepare detailed project notes</span>
            <span className='block rounded bg-purple-100 p-1'>Multiple scheduled items</span>
          </span>
        )}
      </span>
    ),
  },
};

export const LeapYear: Story = {
  args: {
    defaultMonth: new Date(2024, 1, 1),
  },
};

export const MondayFirst: Story = {
  args: {
    weekStartsOn: 1,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole('columnheader');
    await expect(headings[0]).toHaveTextContent('Mon');
    await expect(headings[6]).toHaveTextContent('Sun');
  },
};

const ControlledCalendar = () => {
  const [month, setMonth] = useState(new Date(2024, 11, 1));
  return (
    <Calendar month={month} onMonthChange={setMonth} locale='en-US' classNames={baseClassNames} />
  );
};

export const ControlledMonth: Story = {
  render: () => <ControlledCalendar />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await expect(canvas.getByRole('grid', { name: 'January 2025' })).toBeInTheDocument();
  },
};

export const CustomHeader: Story = {
  args: {
    renderHeader: ({ label, goToPreviousMonth, goToNextMonth }) => (
      <header className='flex items-center justify-between rounded-lg bg-slate-900 p-3 text-white'>
        <button type='button' onClick={goToPreviousMonth} aria-label='Back one month'>
          Back
        </button>
        <strong>{label}</strong>
        <button type='button' onClick={goToNextMonth} aria-label='Forward one month'>
          Forward
        </button>
      </header>
    ),
  },
};

export const Mobile: Story = {
  args: {
    classNames: {
      ...baseClassNames,
      day: 'min-h-16 overflow-hidden border-b border-r border-slate-100 p-1 text-xs',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
