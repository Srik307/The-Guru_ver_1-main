const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

console.log(process.env.SECRET_KEY);

const generateToken = (user) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.SECRET_KEY,
            (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            }
        );
    });
};

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            resolve(decoded); // Return the decoded token including the role
        } catch (error) {
            console.log(error);
            reject(null);
        }
    });
};

module.exports = { generateToken, verifyToken };
