const multer = require('multer');
const path = require('path');
const fs = require('fs');

//Old Code for Disk Storage

const storageprofile= multer.memoryStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, 'uploads/profile');
      if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'));
      }
      if (!fs.existsSync(path.join(__dirname, 'uploads/profile'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads/profile'));
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        console.log(JSON.stringify(file));
      cb(null, `${file.originalname}`);
    },
  });



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, 'uploads/routines');
      if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads'));
      }
      if (!fs.existsSync(path.join(__dirname, 'uploads/routines'))) {
        fs.mkdirSync(path.join(__dirname, 'uploads/routines'));
      }
      cb(null, uploadPath);
    },
  filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Specify the filename format
  }
});


module.exports={
    storageprofile,
    storage
}