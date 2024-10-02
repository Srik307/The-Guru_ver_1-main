const { initializeApp } = require('firebase/app');
const { getStorage, ref, uploadBytes, getDownloadURL }=require('firebase/storage');
const multer=require('multer');
const { firebaseConfig }=require('../Connections/firebaseConfig');

const app = initializeApp(firebaseConfig);
const store = getStorage(app);

const storage = multer.memoryStorage();
const upload = multer({ storage });

const getFileName = (file)=> {
  return Date.now() + '-' + file.originalname;
};

const uploadFile = async (file,folderName) =>{
    const fileName = folderName!="profile"?getFileName(file):file.originalname;
    console.log(fileName);
    const storageRef = ref(store,folderName+'/'+fileName);
    const snapshot = await uploadBytes(storageRef, file.buffer);
    const url = await getDownloadURL(snapshot.ref);
    return url;
}

module.exports={upload, uploadFile};