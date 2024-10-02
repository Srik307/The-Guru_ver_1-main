const {ARoutine,Routine}=require('../database/model');
const {verifyToken}=require('../middlewares/AuthToken');
const { uploadFile } = require('../utils/firebaseStorage');

const getRoutine = async (req, res) => {
    const {routineId,type}=req.body;
    console.log(routineId);
    let routine;
    if(type==='AR'){
        routine = await ARoutine.findById(routineId);
    }
    else{
    routine = await Routine.findById(routineId);
    }
    if (!routine) {
        return res.status(404).json({ error: 'Routine not found' });
    }
    res.json(routine);
    }


const addRoutine = async (req, res) => {
    try {
        let token = req.headers.authorization;
        console.log(token,"token");
        token=token.split(' ')[1];
        let user_id=await verifyToken(token);
        let routine_data = {...req.body};
        let days=JSON.parse(routine_data.days);
        routine_data.days=days;
        console.log(req.files['img']);
        if(req.files['img']!=undefined){
                try{
                const url=await uploadFile(req.files['img'][0],'routines');
                //let photo=req.files['img'][0].path.split('uploads')[1];
                //photo=photo.replace(/\\/g, "/");
                console.log(routine_data);
                routine_data['img']={};
                routine_data['img']['src'] = url;
                }
                catch(err){
                    console.log(err);
                }
        }
        if(req.files['vi']!=undefined){
            try{
            const url=await uploadFile(req.files['vi'][0],'routines');
            //let cover=req.files['vi'][0].path.split('uploads')[1];
            routine_data.vi={};
            //cover=cover.replace(/\\/g, "/");
            routine_data.vi.src = url;
        }
        catch(err){
            console.log(err);
        }
    }
        if(req.files['audio']!=undefined){
            try{
            const url=await uploadFile(req.files['audio'][0],'routines');
            //let audio=req.files['audio'][0].path.split('uploads')[1];
            //audio=audio.replace(/\\/g, "/");
            routine_data['au']={};
            routine_data['au']['src'] = url;
            }
            catch(err){
                console.log(err);
            }
        }
    routine_data.by=user_id.id;
    console.log(routine_data);
    
    const newRoutine = new Routine(routine_data);
    await newRoutine.save();
    console.log(routine_data,"routine_data");
        res
            .status(200)
            .json({msg: 'Routine Added Successfully',routine:newRoutine});
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .send('Server Error');
    }
}

const deleteRoutine = async (req, res) => {
    try {
        let token = req.headers.authorization;
        console.log(token,"token");
        token=token.split(' ')[1];
        let user_id=await verifyToken(token);
        let routine_data = req.body;
    await Routine.findByIdAndDelete(routine_data.r_id);
    console.log(routine_data,"routine_data");
        res
            .status(200)
            .json({msg: 'Routine deleted Successfully'});
    }
    catch (err) {
        console.error(err);
        res
            .status(500)
            .send('Server Error');
    }
}

const getSuggestedRoutines=async(req,res)=>{
    //return all routines in ARoutines
    let routines=await ARoutine.find();
    res.json({"sR":routines});
}


module.exports = {
    getRoutine,
    addRoutine,
    deleteRoutine,
    getSuggestedRoutines
}