const {User,Auth}=require('../database/model');
const bcrypt = require('bcryptjs');
const {generateToken,verifyToken} = require('../middlewares/AuthToken');

const register =async (req, res) => {
        try {
            let user = req.body;
            console.log(user);
            
            // Check if user already exists
            let existsuser = await
            Auth.findOne({email:user.email});
            console.log(existsuser);
            if (existsuser) {
                return res
                    .status(400)
                    .json({msg: 'User already exists'});
            }
            // Create new user
            const newuser = new User(user);
            console.log(user);
            
            let auth= new Auth({email:user.email,password:user.password});
            // Hash password
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword= await bcrypt.hash(user.password, salt);
            auth.password = encryptedPassword;
            // Save user
            await auth.save();
            await newuser.save();
            // Create JWT;
            const token=await generateToken(newuser);
            res
            .status(200).json({user:newuser,token:token});
        } catch (err) {
            console.error(err);
            res
                .status(500)
                .send('Server Error');
        }
    }


const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(email,password);
        // Check if user exists
        let user = await
        Auth.findOne({email});
        if (!user){
            return res
                .status(400)
                .json({msg: 'Invalid Credentials'});
        }
        // Check if password is correct

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({msg: 'Invalid Credentials'});
        }
        user = await User.findOne({email});
        // Create JWT
        const token=await generateToken(user);
        res
        .status(200).json({token});
    }   
    catch (err) {
        console.error(err);
        res
            .status(500)
            .send('Server Error');
    }
}


module.exports={register,login};
