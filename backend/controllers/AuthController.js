const {User,Auth}=require('../database/model');
const bcrypt = require('bcryptjs');
const {generateToken} = require('../middlewares/AuthToken');
const Response = require('../utils/Response');

const register =async (req, res) => {
        try {
            let user = req.body;
            console.log(user,'hub');
            
            // Check if user already exists
            let existsuser = await
            Auth.findOne({email:user.email});
            console.log(existsuser);
            if (existsuser) {
                return Response(res, 400, 'User already exists with this email');
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
            return Response(res, 200, 'User created successfully', {token,user:newuser});
        } catch (err) {
            console.error(err);
            return Response(res, 500, 'Server Error');
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
            return Response(res, 400, 'Email not found');
        }
        // Check if password is correct

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return Response(res, 400, 'Invalid password');
        }
        user = await User.findOne({email});
        // Create JWT
        const token=await generateToken(user);
        return Response(res, 200, 'Login successful', {token});
    }   
    catch (err) {
        console.error(err);
        return Response(res, 500, 'Server Error');
    }
}


module.exports={register,login};
