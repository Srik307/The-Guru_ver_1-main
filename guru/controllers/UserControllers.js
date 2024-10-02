import {ip} from "../datastore/data";

export const addRoutineOnFrontend= async (routine,user) => {
    return new Promise(async(resolve,reject)=>{
        try {
            console.log(user);
            user.routines.push({r_id:routine._id,r_name:routine.name,cate:routine.cate});
            console.log(user,"user");
            resolve(user);
        } catch (error) {
            console.error('Error adding routine:', error);
            reject('Error adding routine');
        }
    }
)
};

export const deleteRoutineOnFrontend= async (routine,user) => {
    return new Promise(async(resolve,reject)=>{
        try {
            console.log(user);
            const arr= user.routines.filter((r)=>r.r_id!=routine.r_id);
            user.routines=arr;
            resolve(user);
        } catch (error) {
            console.error('Error adding routine:', error);
            reject('Error adding routine');
        }
    }
)
};

export const updateUser=async (user,token)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            
            console.log("n",JSON.stringify(user),token);
            const response = await fetch(`${ip}/api/user/update`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'authorization':`Bearer ${token}`
                },
                body:JSON.stringify(user)
            });
            const data = await response.json();
            console.log("q",data);
            resolve(data);
        } catch (error) {
            console.error('Error updating user:', error);
            reject('Error updating user');
        }
    });
}


export const getQuestions=async (token)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const response = await fetch(`${ip}/api/user/questions`,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'authorization':`Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log(data);
            resolve(data);
        } catch (error) {
            console.error('Error getQuestion:', error);
            reject('Error getQuestion');
        }
    });
}





