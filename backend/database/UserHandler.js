import User from '../models/User.js';

export const CreateUser = async (user) => {
    try {
        const newUser = new User(user);
        await newUser.save();
    } catch (error) {
        console.log(error);
    }
};

export const GetUser = async (user_id) => {
    try {
        const user=findbyId(user_id);
        return user;
    }
    catch (error) {
        console.log(error);
    }
}

export const UpdateUser = async (email, user) => {
    try {
        await User.updateOne({ email: email }, user);
    }
    catch (error) {
        console.log(error);
    }
}

export const DeleteUser = async (email) => {
    try {
        await User.deleteOne({ email: email });
    }
    catch (error) {
        console.log(error);
    }
}

export const AddRoutine = async (email, routine) => {
    try {
        await User.updateOne({ email: email }, { $push: { routines: routine } });
    }
    catch (error) {
        console.log(error);
    }
}

export const DeleteRoutine = async (email, r_id) => {
    try {
        await User.update   ({ email: email }, { $pull: { routines: { r_id: r_id } } });
    }
    catch (error) {
        console.log(error);
    }
}

export const UpdateRoutine = async (email, r_id, routine) => {
    try {
        await User.updateOne({ email: email, 'routines.r_id': r_id }, { $set: { 'routines.$': routine } });
    }
    catch (error) {
        console.log(error);
    }
}

export const AddDailyUpdate = async (email, dailyupdate) => {
    try {
        await User.updateOne({ email: email }, { $push: { dailyupdates: dailyupdate } });
    }
    catch (error) {
        console.log(error);
    }
}

export const DeleteDailyUpdate = async (email, dailyupdate) => {
    try {
        await User.updateOne({ email: email }, { $pull: { dailyupdates: dailyupdate } });
    }
    catch (error) {
        console.log(error);
    }
}

export const UpdateUserMeta = async (email, usermeta) => {
    try {
        await User.updateOne({ email: email }, { usermeta: usermeta });
    }
    catch (error) {
        console.log(error);
    }
}

export const UpdateUserPhoto = async (email, photo) => {
    try {
        await User.update
        ({ email: email }, { photo: photo });
    }
    catch (error) {
        console.log(error);
    }
}

export const UpdateUserPassword = async (email, password) => {
    try {
        await User.updateOne({ email: email }, { password: password });
    }
    catch (error) {
        console.log(error);
    }
}

export const UpdateUserDetails = async (email, details) => {
    try {
        await User.updateOne({ email: email }, details);    }
    catch (error) {
        console.log(error);
    }
}




