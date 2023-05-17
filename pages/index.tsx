import Head from 'next/head'
import BoxDay from '@/components/boxDay'
import styles from '@/pages/index.module.css'
import { useEffect, useState } from 'react';
import { Day } from 'classes/day';
import { Event } from 'classes/event';
import { getCurrentDateDetail, getNumberDayName, generateRandomHexColor, 
  getMonthNameByNumber, saveGlobalData } from 'helper/functions';

interface Input {
  selectedIndex: number;
  selectedEvent: number;
  selected: string;
  eventNumber: number;
  eventColor: string;
  name: string;
  time: number;
  invitees: string;
}

export default function Home() {
  const calendar: JSX.Element[] = [];
  const currentDateDetail = getCurrentDateDetail();
  let firstDay = currentDateDetail.firstDay;
  let lastDay = currentDateDetail.lastDay;
  let lastDate = currentDateDetail.lastDate;
  let currentMonth = currentDateDetail.currentMonth;
  let currentYear = currentDateDetail.currentYear;
  let lastDatePreviousMonth = currentDateDetail.lastDatePreviousMonth;
  let firstDayNumber = (lastDatePreviousMonth - getNumberDayName(firstDay));
  let minusDay = (lastDatePreviousMonth - getNumberDayName(firstDay));
  let isActive = false;
  let counterToPrint = 0;
  let generatedColors: string[] = [];
  const loopCount = firstDayNumber < 26 ? 6 : 5;

  const [days, setDays] = useState<Day[]>([]);
  const [input, setInput] = useState<Input>({
    selectedIndex: -1,
    selectedEvent: -1,
    selected: "-",
    eventNumber: 0,
    eventColor: "#FFFFFF",
    name: "",
    time: 1,
    invitees: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(input.selectedIndex == -1){
      alert("please select the day");
      return;
    }
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if(input.selectedIndex == -1){
      alert("Please select day");
      return;
    } 
    
    if (!input.name || !input.time || !input.invitees) {
      alert("Invalid input");
      return;
    }

    if (input.time < 1 || input.time > 24) {
      alert("Invalid time");
      return;
    }

    if(days[input.selectedIndex].events.length < 3){
      const tempDays = [...days];
  
      const colorRandom = generateRandomHexColor(generatedColors)
      const event = new Event (input.name, input.time, input.invitees, colorRandom);
      generatedColors.push(colorRandom);
  
      tempDays[input.selectedIndex].events.push(event);
  
      setDays(tempDays);
      saveGlobalData(tempDays, generatedColors, currentMonth);
      
      setInput((prevInput) => ({
        ...prevInput, 
        ["selectedIndex"]: -1,
        ["selectedEvent"]: 0,
        ["selected"]: `-`,
        ["eventNumber"]: 0,
        ["eventColor"]: "#FFFFFF",
        ["name"]: "",
        ["time"]: 1,
        ["invitees"]: "",
      }));
      alert("success save data");
    } else {
      alert("sorry you cannot add event again, maximum exceed 3 item per day");
    }
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if(input.selectedEvent == -1){
      alert("Please select event, before click button update");
    } else {
      const tempDays = [...days];
  
      const updatedEvent = {
        ...tempDays[input.selectedIndex].events[input.selectedEvent],
        name: input.name,
        time: input.time,
        invitees: input.invitees,
      };
  
      tempDays[input.selectedIndex].events[input.selectedEvent] = updatedEvent;
  
      setDays(tempDays);
      saveGlobalData(tempDays, generatedColors, currentMonth);
      alert("success save data");
    }
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if(input.selectedEvent == -1){
      alert("Please select event, before click button delete");
    } else {
      const tempDays = [...days];
  
      tempDays[input.selectedIndex].events.splice(input.selectedEvent, 1);

      setDays(tempDays);
      saveGlobalData(tempDays, generatedColors, currentMonth);
      
      setInput((prevInput) => ({
        ...prevInput, 
        ["selectedIndex"]: -1,
        ["selectedEvent"]: 0,
        ["selected"]: `-`,
        ["eventNumber"]: 0,
        ["eventColor"]: "#FFFFFF",
        ["name"]: "",
        ["time"]: 1,
        ["invitees"]: "",
      }));
      alert("success delete data");
    }
  };

  const onClickEvent = (boxIndex: number, eventIndex:number) => {
    const indexChange = boxIndex
    console.log("eventIndex", eventIndex)
    console.log("days[indexChange].events[eventIndex].color", days[indexChange].events[eventIndex].color)
    setInput((prevInput) => ({
      ...prevInput,
      ["selectedIndex"]: indexChange,
      ["selectedEvent"]: eventIndex,
      ["selected"]: `${currentYear} ${getMonthNameByNumber(currentMonth-1)} ${days[indexChange].dayNumber}`,
      ["eventColor"]: days[indexChange].events[eventIndex].color,
      ["eventNumber"]: eventIndex+1,
      ["name"]: days[indexChange].events[eventIndex].name,
      ["time"]: days[indexChange].events[eventIndex].time,
      ["invitees"]: days[indexChange].events[eventIndex].invitees,
    }));
    console.log("input", input)
  }

  const onClickBoxDay = (boxIndex: number) => {
    const indexSelected = boxIndex;
    console.log("indexSelected", indexSelected)
    if(days[indexSelected].events.length < 3){
      setInput((prevInput) => ({
        ...prevInput, 
        ["selectedIndex"]: indexSelected,
        ["selected"]: `${currentYear} ${getMonthNameByNumber(currentMonth-1)} ${days[indexSelected].dayNumber}`,
        ["selectedEvent"]: -1,
        ["eventNumber"]: 0,
        ["eventColor"]: "#FFFFFF",
      }));
    } else {
      alert("sorry you cannot add event again, maximum exceed 3 item per day");
    }
  }

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    setInput((prevInput) => ({
      ...prevInput,
      ["selectedIndex"]: -1,
      ["selectedEvent"]: -1,
      ["selected"]: "-",
      ["eventColor"]: "#FFF",
      ["eventNumber"]: 0,
      ["name"]: "",
      ["time"]: 1,
      ["invitees"]: "",
    }));
  }

  // Function to initialize the days array with 30 Day objects
  const initializeDays = () => {
    localStorage.clear();
    const newDays: Day[] = [];

    for (let i = 0; i < lastDate; i++) {
      const day = new Day(currentMonth, i + 1);
      newDays.push(day);
    }
    saveGlobalData(newDays, generatedColors, currentMonth);
    
    setDays(newDays);
  };

  // Looping for calendar printed
  for (let i = 0; i < loopCount; i++) {
    const boxDays = [];
  
    for (let j = 0; j < 7; j++) {
      if(firstDayNumber == lastDatePreviousMonth){
        lastDatePreviousMonth = lastDate;
        firstDayNumber = 0;
        counterToPrint = 0;
        isActive = !isActive;
      } else {
        counterToPrint++;
      }
      boxDays.push(
        <BoxDay 
          dayNumber={firstDayNumber+1} 
          isActive={isActive} 
          events={isActive && counterToPrint < days.length ? days[counterToPrint].events : []} 
          boxIndex={7 * i + j} key={`box-day-${j+i}`} 
          onClickEvent={onClickEvent} 
          onClickBoxDay={onClickBoxDay} />
      );
      firstDayNumber++;
    }
  
    calendar.push(
      <div className={styles.calendar_container} key={`row-calendar-${i}`}>
        {boxDays}
      </div>
    );
  }

  useEffect(() => {
    const tempInit = localStorage.getItem("globalData");
    if (tempInit) {
      const parsedData = JSON.parse(tempInit);
      setDays([...parsedData.datas]);
      generatedColors = parsedData.generatedColors;
      if(currentMonth != parsedData.currentMonth){
        initializeDays();
      }
    }else {
      initializeDays();
    }
  }, [])

  useEffect(() => {
  }, [days])

  return (
    <div>
      <Head>
        <title>Calendar FE Test</title>
      </Head>

      <main className={styles.main}>
        <div className={styles.calendar_container_header}>
          <div className={styles.calendar_container_header_item}>Monday</div>
          <div className={styles.calendar_container_header_item}>Tuesday</div>
          <div className={styles.calendar_container_header_item}>Wednesday</div>
          <div className={styles.calendar_container_header_item}>Thursday</div>
          <div className={styles.calendar_container_header_item}>Friday</div>
          <div className={styles.calendar_container_header_item}>Saturday</div>
          <div className={styles.calendar_container_header_item}>Sunday</div>
        </div>
        {calendar}

        <h3>FORM</h3>
        <form onSubmit={handleSubmit} className={styles.form_container}>
          <div className={styles.form_div}>
            <label>
              Selected:
            </label>
            <input
              className={styles.input}
              type="text"
              name="selected"
              value={input.selected}
              disabled
            />
          </div>
          <div className={styles.form_div}>
            <label>
              Event number:
            </label>
            <input
              className={styles.input}
              type="text"
              name="selected"
              value={input.eventNumber}
              disabled
            />
          </div>
          <div className={styles.form_div}>
            <label>
              Event Color:
            </label>
            <input
              style={{backgroundColor: input.eventColor}}
              className={styles.input}
              type="text"
              name="selected"
              disabled
            />
          </div>
          <div className={styles.event_form}>
            <h3>Event : </h3>
            <div className={styles.form_div}>
              <label>
                Name:
              </label>
              <input
                className={styles.input}
                type="text"
                name="name"
                value={input.name}
                onChange={handleChange}
              />
            </div>
            <div className={styles.form_div}>
              <label>
                Time:
              </label>
              <input
                className={styles.input}
                type="number"
                name="time"
                min="1"
                max="24"
                value={input.time}
                onChange={handleChange}
              />
            </div>
            <div className={styles.form_div}>
              <label>
                Invitees:
              </label>
              <input
                className={styles.input}
                type="email"
                name="invitees"
                value={input.invitees}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className={styles.form_div}>
            <button type="submit" className={styles.btn}>Create</button>
            <button type="submit" className={styles.btn} onClick={handleUpdate}>Update</button>
            <button type="submit" className={styles.btn} onClick={handleDelete}>Delete</button>
            <button type="submit" className={styles.btn} onClick={handleReset}>Reset</button>
          </div>
        </form>
      </main>

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
