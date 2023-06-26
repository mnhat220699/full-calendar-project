import { useEffect, useState } from 'react';
import './component.css';
import { Datepicker } from './Datepicker';

const TIME_GIRD = 'timeGrid';
const DAY_GRID_MONTH = 'dayGridMonth';

export function CalendarHeader({ calendarRef, setDuration, setInitialView }) {
  const [date, setDate] = useState();
  const [apiCalendar, setApiCalendar] = useState(calendarRef.current?.getApi());
  const [agendaValue, setAgendaValue] = useState('Week');

  const jumpDropdownList = [
    '1 week',
    '2 weeks',
    '3 weeks',
    '4 weeks',
    '5 weeks',
    '6 weeks',
    '7 weeks',
    '8 weeks',
    '3 months',
    '6 months',
    '1 year',
  ];
  const agendaDropdownList = [
    'Day',
    'Week',
    '2 Weeks',
    '3 Weeks',
    '4 Weeks',
    'Month',
    '3 Days Rolling',
    '4 Days Rolling',
  ];

  useEffect(() => {
    const callApi = calendarRef.current?.getApi();

    if (callApi) {
      setDate(callApi.getDate());
      setApiCalendar(callApi);
    }
  }, [calendarRef]);

  useEffect(() => {
    if (!apiCalendar) return;
    apiCalendar.gotoDate(date);
  }, [date, apiCalendar]);

  const [isDropdownBtn, setIsDropdownBtn] = useState({
    Agenda: false,
    JumpBack: false,
    JumpNext: false,
  });

  const handleDropdownBtn = (btnType) => {
    const dropdownBtn = {
      Agenda: false,
      JumpBack: false,
      JumpNext: false,
    };
    if (btnType === 'Agenda') {
      dropdownBtn.Agenda = !isDropdownBtn.Agenda;
    } else if (btnType === 'JumpBack') {
      dropdownBtn.JumpBack = !isDropdownBtn.JumpBack;
    } else if (btnType === 'JumpNext') {
      dropdownBtn.JumpNext = !isDropdownBtn.JumpNext;
    }
    setIsDropdownBtn(dropdownBtn);
  };

  const hanleClickAgenda = (e) => {
    setAgendaValue(e.target.innerText);
    switch (e.target.innerText) {
      case 'Day':
        setInitialView(TIME_GIRD);
        setDuration({
          day: 1,
        });
        break;
      case 'Week':
        setInitialView(TIME_GIRD);
        setDuration({
          week: 1,
        });
        break;
      case '2 Weeks':
        setInitialView(TIME_GIRD);
        setDuration({
          weeks: 2,
        });
        break;
      case '3 Weeks':
        setInitialView(TIME_GIRD);
        setDuration({
          weeks: 3,
        });
        break;
      case '4 Weeks':
        setInitialView(TIME_GIRD);
        setDuration({
          weeks: 4,
        });
        break;
      case 'Month':
        setInitialView(DAY_GRID_MONTH);
        setDuration({
          month: 1,
        });
        break;
      case '3 Days Rolling':
        setInitialView(TIME_GIRD);
        setDuration({
          days: 3,
        });
        break;
      case '4 Days Rolling':
        setInitialView(TIME_GIRD);
        setDuration({
          days: 4,
        });
        break;
      default:
        setInitialView(TIME_GIRD);
        setDuration({
          week: 1,
        });
        break;
    }
    setDate(apiCalendar?.getDate());
  };

  const handleBtnPrevNextDate = (btnType) => {
    if (!apiCalendar) return;
    if (btnType === 'prev') {
      apiCalendar.prev();
    } else if (btnType === 'next') {
      apiCalendar.next();
    }
    setDate(apiCalendar?.getDate());
  };

  const handleBtnPrevNextYear = (e, btnType) => {
    if (!apiCalendar) return;
    const duration = {};

    switch (e.target.innerText) {
      case '1 week':
        duration.weeks = 1;
        break;
      case '2 weeks':
        duration.weeks = 2;
        break;
      case '3 weeks':
        duration.weeks = 3;
        break;
      case '4 weeks':
        duration.weeks = 4;
        break;
      case '5 weeks':
        duration.weeks = 5;
        break;
      case '6 weeks':
        duration.weeks = 6;
        break;
      case '7 weeks':
        duration.weeks = 7;
        break;
      case '8 weeks':
        duration.weeks = 8;
        break;
      case '3 months':
        duration.months = 3;
        break;
      case '6 months':
        duration.months = 6;
        break;
      case '1 year':
        duration.years = 1;
        break;
      default:
        break;
    }
    const objKey = Object.keys(duration)[0];

    // convert positive number to negative number because btnType === 'jumpPrev'
    if (btnType === 'jumpPrev') duration[objKey] = -duration[objKey];
    apiCalendar.incrementDate(duration);
    setDate(apiCalendar.getDate());
  };

  const handleBtnToday = () => {
    if (!apiCalendar) return;
    apiCalendar.today();
    setDate(apiCalendar.getDate());
  };

  return (
    <div className="calendar-header">
      <div className="left-menu-toolbar">
        <div
          onClick={() => handleDropdownBtn('Agenda')}
          className="dropdown-button default-button"
        >
          <p>{agendaValue}</p>
          {isDropdownBtn.Agenda && (
            <ul className="dropdown-list">
              {agendaDropdownList.map((item) => (
                <li key={item} onClick={hanleClickAgenda}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="center-menu-toolbar">
        <button
          onClick={() => handleBtnPrevNextDate('prev')}
          className="default-button border-right btn-prev"
        >
          {'<'}
        </button>
        <div
          onClick={() => handleDropdownBtn('JumpBack')}
          className="dropdown-button default-button border-right"
        >
          <p>{'<<'}</p>
          {isDropdownBtn.JumpBack && (
            <ul className="dropdown-list dropdown-list-v2">
              {jumpDropdownList.map((jump) => (
                <li
                  key={jump}
                  onClick={(e) => handleBtnPrevNextYear(e, 'jumpPrev')}
                >
                  {jump}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="default-button border-right"
          onClick={() => handleBtnToday()}
        >
          Today
        </button>
        <div className="default-button border-right">
          <Datepicker
            dateSelected={date}
            setDate={setDate}
            agendaData={agendaValue}
          />
        </div>
        <div
          onClick={() => handleDropdownBtn('JumpNext')}
          className="dropdown-button default-button border-right"
        >
          <p>{'>>'}</p>
          {isDropdownBtn.JumpNext && (
            <ul className="dropdown-list dropdown-list-v2">
              {jumpDropdownList.map((jump) => (
                <li
                  key={jump}
                  onClick={(e) => handleBtnPrevNextYear(e, 'jumpNext')}
                >
                  {jump}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={() => handleBtnPrevNextDate('next')}
          className="default-button not-border btn-next"
        >
          {'>'}
        </button>
      </div>
      <div className="right-menu-toolbar"></div>
    </div>
  );
}
