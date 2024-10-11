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


export const updateJournel=async (user_id,token,usermeta,type,image,today)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const Data = new FormData();
            if(type=="image"){
                console.log(user_id,image); 
                if (image) {
                    try {
                      const filePath = image;
                      const file = {
                        uri: filePath,
                        name: `${user_id}_${today}journel.jpg`,
                        type: "image/jpeg",
                      };
                      Data.append("JImage", file);
                      console.log("Image added to form data");
                    } catch (error) {
                      console.error("Error reading image file:", error);
                      return;
                    }
                  }
            }
            Data.append("date",today);
            Data.append('usermeta',JSON.stringify(usermeta));
            const response = await fetch(`${ip}/api/user/updatejournel`,{
                method:'POST',
                headers:{
                    "content-type": "multipart/form-data",
                    "authorization":`Bearer ${token}`
                },
                body:Data
            });
            const data = await response.json();
            console.log(data);
            resolve(data.usermeta);
        } catch (error) {
            console.error('Error updating journel:', error);
            reject('Error updating journel');
        }
    }
)
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





