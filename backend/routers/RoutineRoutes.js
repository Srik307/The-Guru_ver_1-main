const { getRoutine, addRoutine,getSuggestedRoutines, deleteRoutine } = require('../controllers/RoutineController');
const router = require('express').Router();
const {upload} = require('../utils/firebaseStorage');

// Define routes
router.post('/getRoutine', getRoutine);
router.post('/addRoutine', upload.fields([{ name: 'img' }, { name: 'vi' }, { name: 'audio' }]), addRoutine);
router.post('/deleteRoutine', deleteRoutine);
router.post('/getsuggestedR', getSuggestedRoutines);


module.exports = router;