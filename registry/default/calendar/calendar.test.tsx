import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Calendar } from './calendar';

const getGridCells = () => within(screen.getByRole('grid')).getAllByRole('gridcell');

describe('Calendar', () => {
  it('lays out a month as complete weeks with matching date keys', () => {
    render(<Calendar defaultMonth={new Date(2024, 4, 1)} locale='en-US' />);

    const cells = getGridCells();
    expect(cells).toHaveLength(35);
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(cells[0]).toHaveAttribute('data-date', '2024-04-28');
    expect(cells[cells.length - 1]).toHaveAttribute('data-date', '2024-06-01');
    expect(screen.getByRole('gridcell', { name: 'Wednesday, May 1, 2024' })).not.toHaveAttribute(
      'data-outside',
    );
  });

  it.each([
    ['five', new Date(2021, 1, 1), 35],
    ['six', new Date(2020, 7, 1), 42],
  ])('renders a %s-week month', (_label, month, expectedDays) => {
    render(<Calendar defaultMonth={month} locale='en-US' />);
    expect(getGridCells()).toHaveLength(expectedDays);
  });

  it('distinguishes leap years from non-leap years', () => {
    const { rerender } = render(<Calendar month={new Date(2024, 1, 1)} locale='en-US' />);
    expect(
      screen.getByRole('gridcell', { name: 'Thursday, February 29, 2024' }),
    ).not.toHaveAttribute('data-outside');

    rerender(<Calendar month={new Date(2023, 1, 1)} locale='en-US' />);
    expect(screen.queryByRole('gridcell', { name: /February 29, 2023/ })).not.toBeInTheDocument();
  });

  it('starts weekdays and the grid on Monday when requested', () => {
    render(<Calendar defaultMonth={new Date(2024, 4, 1)} locale='en-US' weekStartsOn={1} />);

    const weekdays = screen.getAllByRole('columnheader');
    expect(weekdays[0]).toHaveTextContent('Mon');
    expect(weekdays[6]).toHaveTextContent('Sun');
    expect(getGridCells()[0]).toHaveAttribute('data-date', '2024-04-29');
  });

  it('moves an uncontrolled calendar across the year boundary', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2024, 11, 15)}
        locale='en-US'
        onMonthChange={onMonthChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'January 2025' })).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2025, 0, 1));
  });

  it('requests but does not apply a controlled month change', async () => {
    const user = userEvent.setup();
    const onMonthChange = vi.fn();
    render(<Calendar month={new Date(2024, 4, 20)} locale='en-US' onMonthChange={onMonthChange} />);

    await user.click(screen.getByRole('button', { name: 'Previous month' }));
    expect(screen.getByRole('grid', { name: 'May 2024' })).toBeInTheDocument();
    expect(onMonthChange).toHaveBeenCalledWith(new Date(2024, 3, 1));
  });

  it('supports a consumer-controlled month', async () => {
    const user = userEvent.setup();
    const ControlledCalendar = () => {
      const [month, setMonth] = useState(new Date(2024, 4, 1));
      return <Calendar month={month} onMonthChange={setMonth} locale='en-US' />;
    };
    render(<ControlledCalendar />);

    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(screen.getByRole('grid', { name: 'June 2024' })).toBeInTheDocument();
  });

  it('passes consistent values to renderDay and onDayClick', async () => {
    const user = userEvent.setup();
    const onDayClick = vi.fn();
    render(
      <Calendar
        defaultMonth={new Date(2024, 4, 1)}
        locale='en-US'
        renderDay={({ date, dateKey }) => (
          <time dateTime={dateKey}>
            {dateKey}: {date.getDate()}
          </time>
        )}
        onDayClick={onDayClick}
      />,
    );

    await user.click(screen.getByRole('gridcell', { name: 'Wednesday, May 15, 2024' }));
    expect(screen.getByText('2024-05-15: 15')).toHaveAttribute('datetime', '2024-05-15');
    expect(onDayClick).toHaveBeenCalledTimes(1);
    const clickedDay = onDayClick.mock.calls[0][0];
    expect(clickedDay.dateKey).toBe('2024-05-15');
    expect(clickedDay.date.getFullYear()).toBe(2024);
    expect(clickedDay.date.getMonth()).toBe(4);
    expect(clickedDay.date.getDate()).toBe(15);
    expect(clickedDay.isCurrentMonth).toBe(true);
  });

  it('renders custom header and weekday content', () => {
    render(
      <Calendar
        defaultMonth={new Date(2024, 4, 1)}
        locale='en-US'
        renderHeader={({ label }) => <h2>Schedule: {label}</h2>}
        renderWeekday={({ day, label }) => `${day}-${label}`}
      />,
    );

    expect(screen.getByRole('heading', { name: 'Schedule: May 2024' })).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveTextContent('0-Sun');
  });
});
