import {ip} from "../datastore/data"



export const signUp=(details)=>{
    return new Promise((resolve,reject)=>{
        fetch(`${ip}/api/auth/register`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(details)
        }).then(res=>res.json()).then(data=>{
            resolve(data);
        }).catch(err=>{
            reject(err)
        });
    })
}