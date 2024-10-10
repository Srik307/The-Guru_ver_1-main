import { Alert } from "react-native";
import {ip} from "../datastore/data"



export const signUp=(details)=>{
    //console.log(details,'details');
    return new Promise((resolve,reject)=>{
        fetch(`${ip}/api/auth/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(details)
        }).then(async (res)=>{
            const data=await res.json();
            console.log(data,';qskdm');
            if(res.status!=200){
                    Alert.alert("Error",data.message);
                    reject("Error in SignUp");
            }else{
                resolve(data.data);
            }
        }).catch(err=>{
            reject(err)
        });
    })
}