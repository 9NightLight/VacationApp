import React, {
    useState,
    useEffect,
    useReducer,
    useMemo,
  } from "react";
  import GlobalContext from "./GlobalContext";
  import dayjs from "dayjs"; // , { Dayjs }
  import { onValue, ref, set } from 'firebase/database';
  import { auth } from '../firebase.js';
  import { db } from '../firebase';

  export const ACTIONS = {
    PUSH: "push",
    UPDATE: "update",
    DELETE: "delete",
  }

  
  
  function savedEventsReducer(state, action) {
    switch (action.type) {
      case ACTIONS.PUSH:
        return [...state, action.payload];
      case ACTIONS.UPDATE:
        return state.map((evt) =>
          evt.id === action.payload.id ? action.payload : evt
        );
      case ACTIONS.DELETE:
        return state.filter((evt) => evt.id !== action.payload.id);
      default:
        throw new Error();
    }
  }
  
  function initEvents() { // Here occurs taking events from server 
    // const storageEvents = localStorage.getItem("savedEvents");
    // const parsedEvents = storageEvents ? JSON.parse(storageEvents) : [];
    // console.log(storageEvents, parsedEvents)
    // return parsedEvents;
    // Firebase read
    auth.onAuthStateChanged((user) => {
      let e = new Array();

      if (user) {
        onValue(ref(db, `/events`), (snapshot) => {
          // setEvents(new Array());
          const data = snapshot.val();
          if (data !== null) {
            Object.values(data).map((event) => {
              e = [...e, event]
                // setEvents((oldArray) => [...oldArray, event]);
            });
          }
          // console.log(e)
          return e;
        });
      } else if (!user) 
      {
        return [];
      }
    });
  }

  export default function ContextWrapper(props) {
    const [year, setYear] = useState(dayjs().year());
    const [monthIndex, setMonthIndex] = useState(new Date().getMonth());
    const [smallCalendarMonth, setSmallCalendarMonth] = useState(null);
    const [daySelected, setDaySelected] = useState(dayjs());
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [labels, setLabels] = useState([]);
    const [_savedEvents, dispatchCalEvent] = useReducer(
      savedEventsReducer,
      [],
      // initEvents
    );
    const [savedEvents, setSavedEvents] = React.useState(initEvents)
      
    const filteredEvents = useMemo(() => {
      let e = new Array()
      return e
      // return savedEvents.filter((evt) =>
      //   labels
      //     .filter((lbl) => lbl.checked)
      //     .map((lbl) => lbl.label)
      //     .includes(evt.label)
      // );
    }, [savedEvents, labels]);
  
    // useEffect(() => {
    //   localStorage.setItem("savedEvents", JSON.stringify(savedEvents));
    // }, [savedEvents]);
  
    // useEffect(() => {
    //   setLabels((prevLabels) => {
    //     return [...new Set(savedEvents.map((evt) => evt.label))].map(
    //       (label) => {
    //         const currentLabel = prevLabels.find(
    //           (lbl) => lbl.label === label
    //         );
    //         return {
    //           label,
    //           checked: currentLabel ? currentLabel.checked : true,
    //         };
    //       }
    //     );
    //   });
    // }, [savedEvents]);
  
    // useEffect(() => {
    //   if (smallCalendarMonth !== null) {
    //     setMonthIndex(smallCalendarMonth);
    //   }
    // }, [smallCalendarMonth]);
  
    // useEffect(() => {
    //   if (!showEventModal) {
    //     setSelectedEvent(null);
    //   }
    // }, [showEventModal]);
  
    function updateLabel(label) {
      // setLabels(
      //   labels.map((lbl) => (lbl.label === label.label ? label : lbl))
      // );
    }
  
    return (
      <GlobalContext.Provider
        value={{
          year,
          setYear,
          monthIndex,
          setMonthIndex,
          smallCalendarMonth,
          setSmallCalendarMonth,
          daySelected,
          setDaySelected,
          showEventModal,
          setShowEventModal,
          dispatchCalEvent,
          selectedEvent,
          setSelectedEvent,
          savedEvents,
          setLabels,
          labels,
          updateLabel,
          filteredEvents,
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    );
}