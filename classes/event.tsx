export class Event {
    name: string;
    time: number;
    invitees: string;
    color: string;

    constructor(name: string, time: number, invitees: string, color: string) {
        this.name = name;
        this.time = time;
        this.invitees = invitees;
        this.color = color;
    }
}