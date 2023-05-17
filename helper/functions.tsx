import { Day } from "classes/day";

export function getCurrentDateDetail(): {
    firstDay: string,
    lastDay: string,
    lastDate: number,
    currentMonth: number,
    currentYear: number,
    lastDatePreviousMonth: number,
} {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    // First date of the current month
    const firstDate = new Date(currentYear, currentMonth, 1);
    const firstDay = firstDate.toLocaleString('default', { weekday: 'short' }).substr(0, 3);

    // Last date of the current month
    const lastDate = new Date(currentYear, currentMonth + 1, 0);
    const lastDay = lastDate.toLocaleString('default', { weekday: 'short' }).substr(0, 3);

    // Last date of the previous month
    const lastDatePreviousMonth = new Date(currentYear, currentMonth, 0).getDate();

    return {
    firstDay,
    lastDay,
    lastDate: lastDate.getDate(),
    currentMonth: currentMonth + 1,
    currentYear,
    lastDatePreviousMonth
    };
}

export function getNumberDayName(dayName: string): number {
    const dayList: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return dayList.indexOf(dayName);
}

export function getMonthNameByNumber(monthNumber: number): string {
    const dayList: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return dayList[monthNumber];
}

export function generateRandomHexColor(generatedColors: string[]): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    
    while (true) {
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        
        if (!generatedColors.includes(color)) {
            return color;
        }
        
        color = "#"; // Reset the color if it is not unique
    }
}

export function saveGlobalData(datas: Day[], generatedColors: string[], currentMonth: number): void {
    localStorage.setItem('globalData', JSON.stringify({
        "datas": datas, 
        "generatedColors": generatedColors, 
        "currentMonth": currentMonth
    }))
}