const mongoose= require('mongoose');
//const { type } = require('os');

const userschema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now,
    },
});module.exports=mongoose.model('users',userschema);