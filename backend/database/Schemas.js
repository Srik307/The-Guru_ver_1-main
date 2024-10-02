const mongoose = require("mongoose");

const AuthSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});


const QuestionSchema=new mongoose.Schema({
  ques:String,
  opt:[String]
});


const UserMetaSchema = new mongoose.Schema({
  goal: [String],
  mindm: Number,
  dism: Number,
  bodym: Number,
  dates: Object,
  //{"26/07/2021":[0-journal,1-feeling]}},
});

const UserSchema = new mongoose.Schema({
  mob: String,
  email: String,
  dailyupdates: [String], // Assuming dailyupdates is an array of strings. Adjust if the structure is different.
  usermeta:{type:UserMetaSchema,default:{}},
  name: String,
  age: String, // Age is a string here, consider changing to Number if applicable
  sex: String,
  profession: String,
  photo: String,
  routines: [Object],
  questions:Object
});


const RoutineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  slot: {
    type: String,
    required: true
  },
  des: {
    type: String,
  },
  img: {
    src: {
      type: String,
    }
  },
  vi: {
    src: {
      type: String,
    }
  },
  au: {
    src: {
      type: String,
    }
  },
  streak: {
    type: Number,
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  days: {
    type: [Number],
    required: true
  }
});



module.exports= {AuthSchema,UserSchema,RoutineSchema,QuestionSchema};