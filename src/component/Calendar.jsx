import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import { addHours, format, subHours } from 'date-fns';
import { createRef, useEffect, useState } from 'react';
import { CalendarHeader } from './CanlendarHeader';

import { data as dataFetch } from '../data';

export function Calendar() {
  const { innerWidth } = window;
  const [data, setData] = useState([]);
  const [duration, setDuration] = useState({
    week: 1,
  });
  const [listJob, setListJob] = useState([
    {
      event: {
        id: '1asdqwe',
      },
      title: 'Item 1',
      id: '1asdqwe',
      date: new Date(),
      start: new Date(),
      end: addHours(new Date(), 1),
    },
    {
      event: {
        id: '2asdqwe',
      },
      title: 'Item 2',
      id: '2asdqwe',
      date: new Date(),
      start: new Date(),
      end: addHours(new Date(), 1),
    },
    {
      event: {
        id: '3asdqwe',
      },
      title: 'Item 3',
      id: '3asdqwe',
      date: new Date(),
      start: new Date(),
      end: addHours(new Date(), 1),
    },
    {
      event: {
        id: '4asdqwe',
      },
      title: 'Item 4',
      id: '4asdqwe',
      date: new Date(),
      start: new Date(),
      end: addHours(new Date(), 1),
    },
    {
      event: {
        id: '5asdqwe',
      },
      title: 'Item 5',
      id: '5asdqwe',
      date: new Date(),
      start: new Date(),
      end: addHours(new Date(), 1),
    },
  ]);

  useEffect(() => {
    let draggableEl = document.getElementById('draggable-events');
    new Draggable(draggableEl, {
      itemSelector: '.job-event',
      eventData: function (eventEl) {
        let id = eventEl.getAttribute('data');
        let title = eventEl.getAttribute('title');
        setData((prevList) => [
          ...prevList,
          {
            event: {
              id,
              start: new Date(),
              end: addHours(new Date(), 1),
            },
            tile: { header: title },
            date_label: new Date(),
            color: {
              border: '#cfcfcf',
              text: '#999999',
              background: '#ebebeb',
            },
          },
        ]);

        return {
          id: id,
          title: title,
          create: true,
        };
      },
    });
  }, []);

  const calendarRef = createRef();

  useEffect(() => {
    (async () => {
      try {
        // const res = await fetch('http://localhost:3002/data');
        // const data = await res.json();
        setData(dataFetch);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const eventSetTimeToDragAndDrop = (info) => {
    const items = data.map((ev) => {
      if (ev.event.id === info.event._def.publicId) {
        ev.color.background = '#347deb';
        ev.color.text = '#fff';
        ev.event.start = subHours(info.event._instance.range.start, 7);
        ev.event.end = subHours(info.event._instance.range.end, 7);
      }
      return ev;
    });

    const jobs = listJob.filter((job) => {
      if (job.event.id === info.event._def.publicId) {
        return;
      }
      return job;
    });
    setListJob(jobs);
    setData(items);
  };

  return (
    <div className="section">
      <div className="left-calendar">
        <CalendarHeader
          calendarRef={calendarRef}
          setDuration={setDuration}
          setInitialView="timeGrid"
        />
        <FullCalendar
          eventDragStop={(info) => {
            // subtract 180 because 180 is width of event dragging
            const curentWidth = innerWidth - 180;
            if (info.jsEvent.offsetX > curentWidth) {
              const item = data.filter((ev) => {
                if (ev.event.id !== info.event._def.publicId) {
                  return ev;
                }
              });
              setListJob([
                ...listJob,
                {
                  title: info.event._def.title,
                  id: info.event._def.publicId,
                  event: { id: info.event._def.publicId },
                },
              ]);
              setData(item);
            }
            return;
          }}
          eventResize={eventSetTimeToDragAndDrop}
          eventReceive={eventSetTimeToDragAndDrop}
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          droppable={true}
          initialView="timeGrid"
          editable={true}
          eventDrop={eventSetTimeToDragAndDrop}
          headerToolbar={false}
          events={data.map((item) => ({
            id: item.event.id,
            title: item.tile.header,
            date: format(new Date(item.date_label).getTime(), 'yyyy-MM-dd'),
            start: item.event.start,
            end: item.event.end,
            textColor: item.color.text,
            borderColor: item.color.border,
            backgroundColor: item.color.background,
          }))}
          duration={duration}
          dayHeaderFormat={{
            weekday: 'short',
            month: 'numeric',
            day: 'numeric',
            omitCommas: true,
          }}
        />
      </div>
      <div id="draggable-events">
        <p>
          <strong> Events</strong>
        </p>
        {listJob.map((event) => (
          <div
            className="job-event"
            title={event.title}
            data={event.id}
            key={event.id}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
