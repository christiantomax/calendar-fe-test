import { Event } from "./event";

export class Day {
    month: number;
    dayNumber: number;
    events: Event[];

    constructor(month: number, dayNumber: number) {
        this.month = month;
        this.dayNumber = dayNumber;
        this.events = [];
    }
}