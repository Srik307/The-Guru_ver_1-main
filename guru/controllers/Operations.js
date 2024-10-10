import AsyncStorage from "@react-native-async-storage/async-storage";
import { addRountineOnBackend, checkAndFetchStoreRoutineAll, deleteRountineOnBackend } from "./RoutineHandler";
import { storeSchedule,createSchedule, addRoutineToSchedule, deleteRoutineSchedule} from "./Schedule";
import { addRoutineOnFrontend, deleteRoutineOnFrontend, updateUser } from "./UserControllers";
import { Storeit,Retrieveit, Removeit} from "./LocalStorage";
import {ip,useAuthStore} from "../datastore/data"

export const getuser = (token) => {
    return new Promise(async(resolve,reject)=>{
        console.log(token,"token");
        fetch(`${ip}/api/user/getuser`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'authorization':`Bearer ${token}`
            }
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                console.log(data.error);
            }
            else{
                resolve(data.user);
            }
        }).catch(err=>{
            console.log(err);
        });
    });
}


export const postLogin =(user,token,params) =>{
    return new Promise(async(resolve,reject)=>{
        if(params){
            const schedule=await Retrieveit('@schedule');
            console.log("1",schedule);
            await storeSchedule(schedule);
           }
           else{
            await AsyncStorage.clear();
       console.log('token',token);
       await Storeit('token',token);
       const fetchedRoutines= await checkAndFetchStoreRoutineAll(user.routines);
       console.log(fetchedRoutines,"fetched routines");
        const schedule=await createSchedule(fetchedRoutines);
        console.log(schedule,typeof(schedule));
        await storeSchedule(schedule);
       }
        resolve();
    });
}


export const createNewRoutine = (user,routine,formData,token) => {
    return new Promise(async(resolve,reject)=>{
        console.log(routine,"routine");
        console.log('\n');
        console.log(token,user);
        routine=await addRountineOnBackend(formData,token);
        routine.cate="UR";
        let newuser=await addRoutineOnFrontend(routine,user);
        await updateUser(newuser,token);
        await Storeit(routine._id,routine);
        const newschedule=await addRoutineToSchedule(await Retrieveit('@schedule'),routine);
        await Storeit('@schedule',newschedule);
        resolve({newuser,newschedule});
    });
}


export const addSRoutine = (user,routine,token) => {
    return new Promise(async(resolve,reject)=>{
        console.log(routine,"routine");
        console.log('\n');
        console.log(token,user);
        routine.cate="AR";
        let newuser=await addRoutineOnFrontend(routine,user);
        await updateUser(newuser,token);
        console.log(newuser,"newuser");
        
        const newschedule=await addRoutineToSchedule(await Retrieveit('@schedule'),routine);
        
        await Storeit('@schedule',newschedule);
        resolve({newuser,newschedule});
    });
}

export const deleteRoutine = (user,routine,token) => {
    return new Promise(async(resolve,reject)=>{
        console.log(routine,"routine");
        console.log('\n');
        console.log(token,user);
        let newuser=await deleteRoutineOnFrontend(routine,user); 
        console.log(newuser,"newuser");
        const newschedule=await deleteRoutineSchedule(routine,await Retrieveit('@schedule'));
        await Removeit(routine.r_id);
        await Removeit('@schedule');
        await Storeit('@schedule',newschedule);
        if(routine.cate!="CR"){
            resolve({newuser,newschedule});
        }
        await deleteRountineOnBackend(routine,token);
        await updateUser(newuser,token);
        resolve({newuser,newschedule});
    });
}



export const logout = async () => {
    await AsyncStorage.clear();
    useAuthStore.setState({isAuthenticated:false});
    console.log('Logged out');
}