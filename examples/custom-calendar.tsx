"use client"

import { Calendar } from "../registry/default/calendar/calendar"

export function CustomCalendarExample() {
  return (
    <Calendar
      locale="zh-CN"
      className="max-w-3xl"
      classNames={{
        day: "aspect-square border p-2",
        dayOutside: "opacity-30",
        dayToday: "ring-2 ring-primary",
      }}
      renderDay={({ date, isCurrentMonth }) => (
        <div className="flex h-full flex-col">
          <span className="text-sm">{date.getDate()}</span>
          {isCurrentMonth && <div className="mt-auto">任意 React 内容</div>}
        </div>
      )}
      onDayClick={({ dateKey }) => console.log(dateKey)}
    />
  )
}
