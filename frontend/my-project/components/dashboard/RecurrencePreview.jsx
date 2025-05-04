"use client";
import { useMemo } from 'react';
import { Calendar } from "react-calendar";
import { addDays, addWeeks, addMonths, addYears, isWithinInterval, eachDayOfInterval } from 'date-fns';

export default function RecurrencePreview({ recurrenceSettings }) {
  const previewDates = useMemo(() => {
    const dates = new Set();
    const startDate = recurrenceSettings.frequency === 'custom' 
      ? recurrenceSettings.customSettings.startDate
      : new Date();
    
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 3); // Preview next 3 months

    const addDate = (date) => {
      if (isWithinInterval(date, { start: startDate, end: endDate })) {
        dates.add(date.toISOString().split('T')[0]);
      }
    };

    switch (recurrenceSettings.frequency) {
      case 'daily':
        for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
          addDate(new Date(d));
        }
        break;

      case 'weekly':
        for (let d = startDate; d <= endDate; d = addWeeks(d, 1)) {
          addDate(new Date(d));
        }
        break;

      case 'monthly':
        for (let d = startDate; d <= endDate; d = addMonths(d, 1)) {
          addDate(new Date(d));
        }
        break;

      case 'yearly':
        for (let d = startDate; d <= endDate; d = addYears(d, 1)) {
          addDate(new Date(d));
        }
        break;

      case 'custom':
        const { interval, unit, weekdays } = recurrenceSettings.customSettings;
        let current = new Date(startDate);

        while (current <= endDate) {
          if (unit === 'weeks') {
            // For weekly recurrence, check if the day is selected
            if (weekdays.includes(current.getDay())) {
              addDate(new Date(current));
            }
          } else {
            addDate(new Date(current));
          }

          // Increment based on unit
          switch (unit) {
            case 'days':
              current = addDays(current, interval);
              break;
            case 'weeks':
              if (current.getDay() === 6) { // If Sunday, jump to next week
                current = addDays(current, (interval - 1) * 7 + 1);
              } else {
                current = addDays(current, 1);
              }
              break;
            case 'months':
              current = addMonths(current, interval);
              break;
          }
        }
        break;
    }

    return Array.from(dates);
  }, [recurrenceSettings]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-white mb-2">Recurrence Preview</h3>
      <Calendar
        value={null}
        tileClassName={({ date }) => {
          return previewDates.includes(date.toISOString().split('T')[0])
            ? 'bg-purple-600 text-white rounded-full'
            : '';
        }}
        className="bg-slate-800 p-4 rounded-lg text-white"
      />
    </div>
  );
}
