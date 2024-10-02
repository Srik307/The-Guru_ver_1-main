const router=require('express').Router();
const {AIchat}=require('../controllers/AIGuruControllers');

router.post('/chat',AIchat);



module.exports=router;