import { Retrieveit, Storeit } from "./LocalStorage";

// Function to store a routine in local storage
import {ip} from "../datastore/data"


  
  // Function to check and fetch routine if not in local storage
export const checkAndFetchStoreRoutineAll = async (routineIdArray) => {
  return new Promise(async (resolve, reject) => {
    const fetchedRoutines = [];
  
    for (const unroutine of routineIdArray) {
      let routine = await Retrieveit(unroutine.r_id);
  
      if (!routine) {
        // Fetch the routine from the remote source
        try {
          const response = await fetch(`${ip}/api/routines/getRoutine`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify({
              routineId:unroutine.r_id,
              type:unroutine.cate
            })
          });
          routine = await response.json();
        } catch (error) {
          console.error('Error fetching routine:', error);
        }
      }
  
      if (routine) {
        if(routine.error==undefined){
        fetchedRoutines.push(routine);}
      }
    }
  
    resolve(fetchedRoutines);
  }
  );
  };


export const addRountineOnBackend=async (routine,token)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      const response = await fetch(`${ip}/api/routines/addRoutine`,{
        method:'POST',
        headers:{
          'authorization':`Bearer ${token}`
        },
        body:routine
      });
      console.log(data);
      
      const data = await response.json();
      console.log(data);
      resolve(data.routine);
    } catch (error) {
      console.error('Error adding routine:', error);
      reject('Error adding routine');
    }
  });
}

export const deleteRountineOnBackend=async (routine,token)=>{
  return new Promise(async(resolve,reject)=>{
    try {
      console.log("hwhh",routine);
      
      const response = await fetch(`${ip}/api/routines/deleteRoutine`,{
        method:'POST',
        headers:{
          'content-type':"application/json",
          'authorization':`Bearer ${token}`
        },
        body:JSON.stringify(routine)
      });
      resolve();
    } catch (error) {
      console.error('Error deleting routine:', error);
      reject('Error deleting routine');
    }
  });
}


