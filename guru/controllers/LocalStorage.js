import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storeit=(key,data)=>{
    return new Promise((resolve,reject)=>{
    try {
        AsyncStorage.setItem(key, JSON.stringify(data));
        resolve('Data stored successfully');
    } catch (error) {
        console.error('Error storing data:', error);
        reject('Error storing data');
    }
});
}

export const Removeit=(key)=>{
    return new Promise((resolve,reject)=>{
    try {
        AsyncStorage.removeItem(key);
        resolve('Data removed successfully');
    } catch (error) {
        console.error('Error storing data:', error);
        reject('Error storing data');
    }
});
}
  
  // Function to retrieve a routine from local storage
export const Retrieveit = async (key) => {
    return new Promise(async(resolve, reject) => {
        try {
            console.log(key,"key");
            const keys=await AsyncStorage.getAllKeys();
            console.log(keys);
            const jsonValue = await AsyncStorage.getItem(key);
            console.log(jsonValue==null,typeof(jsonValue),jsonValue,"jsonvalue");
            if(JSON.parse(jsonValue)==null){
                resolve(jsonValue);
            }
            resolve(jsonValue != null ? JSON.parse(jsonValue) : null);
        } catch (error) {
            console.error('Error retrieving data:', error);
            reject('Error retrieving data');
        }
    });
  };