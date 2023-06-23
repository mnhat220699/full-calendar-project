import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { forwardRef, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import './component.css';

const CustomInput = forwardRef(({ value, onClick }, ref) => {
  return (
    <div className="" onClick={onClick} ref={ref}>
      {value}
    </div>
  );
});

export function Datepicker({ dateSelected, setDate, agendaData }) {
  const [argHighlight, setArgHighlight] = useState({});

  useEffect(() => {
    switch (agendaData) {
      case 'Day':
        setArgHighlight({});
        break;
      case 'Week':
        setArgHighlight({ week: 1 });
        break;
      case '2 Weeks':
        setArgHighlight({ week: 2 });
        break;
      case '3 Weeks':
        setArgHighlight({ week: 3 });

        break;
      case '4 Weeks':
        setArgHighlight({ week: 4 });

        break;
      case 'Month':
        setArgHighlight({ month: 1 });

        break;
      case '3 Days Rolling':
        setArgHighlight({ dayRolling: 3 });

        break;
      case '4 Days Rolling':
        setArgHighlight({ dayRolling: 4 });

        break;
      default:
        setArgHighlight({});
        break;
    }
  }, [agendaData]);

  if (!dateSelected) return;

  const highlightWithRanges = (objDate = {}) => {
    // milliseconds in a day
    const MILLISECONDS_DAY = 1000 * 3600 * 24;
    const listDay = [];
    const listHighlighWithRanges = [];
    if (objDate.week) {
      const subtractDay = endOfWeek(dateSelected) - startOfWeek(dateSelected);
      let dayNumber = Math.floor(subtractDay / MILLISECONDS_DAY);
      dayNumber = objDate.week > 1 ? (dayNumber + 1) * objDate.week : dayNumber;

      for (let i = 1; i < dayNumber; i++) {
        listDay.push(addDays(startOfWeek(dateSelected), i));
      }
      listHighlighWithRanges.push({
        'highlight-start-end-of-week-custom': [
          startOfWeek(dateSelected),
          objDate.week > 1
            ? listDay[listDay.length - 1]
            : endOfWeek(dateSelected),
        ],
      });
    } else if (objDate.month) {
      const subtractDay = endOfMonth(dateSelected) - startOfMonth(dateSelected);
      let dayNumber = Math.floor(subtractDay / MILLISECONDS_DAY);
      for (let i = 1; i < dayNumber; i++) {
        listDay.push(addDays(startOfMonth(dateSelected), i));
      }
      listHighlighWithRanges.push({
        'highlight-start-end-of-week-custom': [
          startOfMonth(dateSelected),
          endOfMonth(dateSelected),
        ],
      });
    } else if (objDate.dayRolling) {
      const endDayRolling = addDays(dateSelected, objDate.dayRolling - 1);
      const subtractDay = endDayRolling - dateSelected;
      let dayNumber = Math.floor(subtractDay / MILLISECONDS_DAY);
      for (let i = 1; i < dayNumber; i++) {
        listDay.push(addDays(dateSelected, i));
      }
      listHighlighWithRanges.push({
        'highlight-start-end-of-week-custom': [dateSelected, endDayRolling],
      });
    }
    const highlightWithRangesClass = [
      ...listHighlighWithRanges,
      {
        'highlight-ranges-custom': listDay,
      },
    ];
    return highlightWithRangesClass;
  };

  return (
    <DatePicker
      selected={dateSelected}
      onChange={(dateEvent) => setDate(dateEvent)}
      popperClassName="custom-popper"
      renderCustomHeader={({
        monthDate,
        customHeaderCount,
        decreaseMonth,
        increaseMonth,
      }) => (
        <div>
          <button
            aria-label="Previous Month"
            className={
              'react-datepicker__navigation react-datepicker__navigation--previous'
            }
            style={customHeaderCount === 1 ? { visibility: 'hidden' } : null}
            onClick={decreaseMonth}
          >
            <span
              className={
                'react-datepicker__navigation-icon react-datepicker__navigation-icon--previous'
              }
            >
              {'<'}
            </span>
          </button>
          <span className="react-datepicker__current-month">
            {monthDate.toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <button
            aria-label="Next Month"
            className={
              'react-datepicker__navigation react-datepicker__navigation--next'
            }
            style={customHeaderCount === 0 ? { visibility: 'hidden' } : null}
            onClick={increaseMonth}
          >
            <span
              className={
                'react-datepicker__navigation-icon react-datepicker__navigation-icon--next'
              }
            >
              {'>'}
            </span>
          </button>
        </div>
      )}
      monthsShown={2}
      customInput={<CustomInput />}
      highlightDates={highlightWithRanges(argHighlight)}
    />
  );
}
