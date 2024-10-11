const { getuser, UpdateUserDetails,getQuestions,UpdateJournel} = require('../controllers/UserController');
const {upload} = require('../utils/firebaseStorage');

const router = require('express').Router();

router.post('/getuser', getuser);

router.post('/update', upload.single('profileImage'),UpdateUserDetails);

router.post('/updatejournel', upload.single('JImage'),UpdateJournel);

router.post('/questions',getQuestions);


module.exports = router;