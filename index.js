require('dotenv').config();
const express=require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const path = require('path');

const PORT= process.env.PORT||4000;
// mongodb://127.0.0.1:27017/Nodecrud
//database connections
mongoose.connect(process.env.DB_URI);
const db = mongoose.connection;
db.on('error',(error)=>console.log(error));
db.once('open',()=> console.log("Connected to the database"));



//middle ware
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(
    session({
        secret:'my secret key',
        saveUninitialized:true,
        resave:false
    })
);
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})

//set template engine
app.set('view engine','ejs');

//route prefix
app.use("",require('./routes/route'));

app.use(express.static("upload"));

app.get("/"),(res,req)=>{
    app.use(express.static(path.resolve(__dirname,"view","build")));
    res.sendFile(path.resolve(__dirname,"view","build","index.ejs"));
}

//app.get('/',(res,req)=>{
  //  console.log('hello')
//});
app.listen(PORT,()=>
{
    console.log(`server start at http://localhost:${PORT}`);
});