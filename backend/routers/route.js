const router=require('express').Router();
const AuthRoute=require('./Authroutes');
const UserRoute=require('./UserRoutes');
const RoutineRoute=require('./RoutineRoutes');
const AIrouter=require("../routers/AIGuruRoutes");



router.use('/user',UserRoute);
router.use('/auth',AuthRoute);
router.use('/routines',RoutineRoute);
router.use('/aiguru',AIrouter)

module.exports=router;