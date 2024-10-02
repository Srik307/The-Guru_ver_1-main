const moongose = require('mongoose');
const {AuthSchema,UserSchema,RoutineSchema,QuestionSchema}=require('./Schemas');
const {db}=require('../Connections/MongoConfig');

const Auth = moongose.model('Auth', AuthSchema);
const User = moongose.model('User', UserSchema);
const ARoutine=moongose.model('ARoutine',RoutineSchema,'Admin_Routines');
const Routine=moongose.model('Routine',RoutineSchema,'User_Routines');
const Questions=moongose.model('Questions',QuestionSchema,'Questions');

module.exports= {Auth,User,Routine,ARoutine,Questions};