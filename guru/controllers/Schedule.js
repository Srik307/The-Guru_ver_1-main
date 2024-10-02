import {format, addDays, parseISO} from 'date-fns';
import { Retrieveit, Storeit } from './LocalStorage';
/**
 * Calculates the nth date from today.
 * @param {number} n - The number of days from today.
 * @returns {string} - The calculated date in 'yyyy-MM-dd' format.
 */
export function getNthDateFromToday(n) {
    const today = new Date();
    const nthDate = addDays(today, n);
    return format(nthDate, 'yyyy-MM-dd');
}

/**
 * Creates a schedule from a list of routine objects within a date range.
 * @param {Array} routines - List of routine objects. Each routine should have a `date` property.
 * @param {string} startDate - The start date in 'yyyy-MM-dd' format.
 * @param {string} endDate - The end date in 'yyyy-MM-dd' format.
 * @returns {Object} - An object with dates as keys and lists of routines as values.
 */
export async function createSchedule(routines) {
    return new Promise(async (resolve, reject) => {
        let schedule = {};
        console.log(routines, 'routines');
        
        for (let i in routines) {
            let routine = routines[i];
            let startDate = routine.startDate;
            let endDate;
            console.log(routine, 'routine');
            
            if (routine.cate == 'AR') {
                startDate=format(new Date(), 'yyyy-MM-dd');
                endDate = getNthDateFromToday(routine.streak);
            } else {
                endDate = routine.endDate;
            }
            console.log(startDate, endDate);
            
            schedule = await addRoutineToSchedule(schedule, routine, startDate, endDate);
            console.log(schedule, 'schedule','\n');
          }

        
        resolve(schedule);
    });
}

export async function deleteRoutineSchedule(routine,schedule) {
    return new Promise(async (resolve, reject) => {
        console.log('routine',schedule,routine);
        const keys=Object.keys(schedule);
        for(let i in keys){
            const daySchedule=schedule[keys[i]];
            const newDaySchedule=daySchedule.filter((r)=>r.r_id!=routine.r_id);
            schedule[keys[i]]=newDaySchedule;
        }
        resolve(schedule);
    });
}



/**
 * Stores the schedule object in local storage.
 * @param {Object} schedule - The schedule object to store.
 */
export async function storeSchedule(schedule) {
    return new Promise(async (resolve, reject) => {
        try {
            await Storeit('@schedule', schedule);
            console.log('Schedule stored successfully');
            resolve();
        } catch (e) {
            console.error('Failed to store schedule', e);
            reject(e);
        }
    });
}

/**
 * Retrieves the schedule object from local storage.
 * @returns {Object|null} - The retrieved schedule object or null if not found.
 */
export async function getSchedule() {
    return new Promise(async (resolve, reject) => {
        try {
            const jsonValue = await Retrieveit('@schedule');
            resolve(
                jsonValue != null
                    ? JSON.parse(jsonValue)
                    : null
            );
        } catch (e) {
            console.error('Failed to retrieve schedule', e);
            reject(e);
        }
    });
}

/**
 * Adds a routine to the schedule for each date within the specified range.
 * @param {Object} schedule - The schedule object.
 * @param {Object} routine - The routine object to add.
 * @param {string} startDate - The start date in 'yyyy-MM-dd' format.
 * @param {string} endDate - The end date in 'yyyy-MM-dd' format.
 * @returns {Object} - The updated schedule object.
 */
export function addRoutineToSchedule(schedule, routine, startDate, endDate) {
    return new Promise(async(resolve, reject) => {
        startDate = routine.startDate;
        console.log('routine',routine);
        if (routine.cate == 'AR') {
            startDate=format(new Date(), 'yyyy-MM-dd');
            endDate = getNthDateFromToday(routine.streak);
            routine.startDate=startDate;
            routine.endDate=endDate;
        } else {
            endDate = routine.endDate;
        }
        console.log(startDate, endDate);
        console.log("sss",routine);
        
        await Storeit(routine._id, routine);

        let currentDate = parseISO(startDate);
        const end = parseISO(endDate);
        while (currentDate <= end) {
            console.log(currentDate);
            
            const formattedDate = format(currentDate, 'yyyy-MM-dd');
            console.log(formattedDate,'formattedDate');
            const day = new Date(currentDate).getDay();
            if (!schedule[formattedDate]) {
                schedule[formattedDate] = [];
            }
            if (routine.days.indexOf(day) != -1) {
                if (currentDate == end) {
                    schedule[formattedDate].push(
                        {r_id: routine._id, r_name: routine.name, completed: false, mc: 1}
                    );
                } else {
                    schedule[formattedDate].push(
                        {r_id: routine._id, r_name: routine.name, completed: false}
                    );
                }
            }
            currentDate = addDays(currentDate, 1);
          }
        resolve(schedule);
    });
}

/* Example usage:
const routines = [
  { id: 1, name: 'Routine 1' },
  { id: 2, name: 'Routine 2' },
  { id: 3, name: 'Routine 3' },
];

const startDate = '2023-10-01';
const endDate = '2023-10-05';

const schedule = createSchedule(routines, startDate, endDate);
console.log(schedule);

const newRoutine = { id: 4, name: 'Routine 4' };
const updatedSchedule = addRoutineToSchedule(schedule, newRoutine, '2023-10-06', '2023-10-10');
console.log(updatedSchedule);
*/