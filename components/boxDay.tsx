import React, { FC } from "react";
import styles from '@/pages/index.module.css'
import { Event } from "classes/event";

interface BoxDayProps {
    boxIndex: number;
    dayNumber: number;
    isActive: boolean;
    events: Event[];
    onClickEvent: (boxIndex: number, eventIndex: number) => void;
    onClickBoxDay: (boxIndex: number) => void;
}

const BoxDay: FC<BoxDayProps> = ({dayNumber, isActive, events, boxIndex, onClickEvent, onClickBoxDay}) => {
    const handleClickEvent: React.MouseEventHandler<HTMLDivElement> = (event) => {
        const eventIndex = Number(event.currentTarget.getAttribute("data-event-index"));
        onClickEvent(boxIndex, eventIndex);
    };

    const handleClickBoxDay: React.MouseEventHandler<HTMLDivElement> = (event) => {
        onClickBoxDay(boxIndex);
    };

    return (
        <div className={isActive ? styles.box_day : styles.box_day_disabled}>
            <div className={styles.day_number} onClick={(e) => {if(isActive){handleClickBoxDay(e)}}}>{dayNumber}</div>
            <div className={styles.day_event_container}>
                {
                    isActive && events &&
                    (
                        <>
                            {
                                events.map((item, index) => (
                                    <div className={styles.day_event} key={boxIndex} style={{backgroundColor: item.color}}
                                        data-event-index={index}
                                        box-index={boxIndex}
                                        onClick={(e) => { if(isActive){handleClickEvent(e)}}}
                                    >
                                        <h5 className={styles.day_event_header} title={item.name}>{item.name}</h5>
                                    </div>
                                ))
                            }
                        </>
                    )
                }
            </div>
        </div>
    )
};

export default BoxDay;