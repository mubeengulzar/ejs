const express= require('express');
const router = express.Router();
const User = require('../models/users');
const multer= require('multer');
const fs = require('fs'); 
const { title } = require('process');
//const { title } = require('process');

// image upload 
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var uploadDir = "./upload";
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    },
});
var upload= multer({
    storage:storage,

}).single('image');

//insert an user into database route

router.post('/add', upload, async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        image: req.file.filename,
    });

    try {
        await user.save();
        req.session.message = {
            type: "success",
            message: "User added successfully!",
        };
        res.redirect("/");
    } catch (err) {
        res.json({ message: err.message, type: "danger" });
    }
});

// API endpoint to retrieve all form data
router.get('/api/form', async (req, res) => {
    try {
      const data = await User.find();
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  


//get all user route 
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', {
            title: 'Home page',
            users: users,
        });
    } catch (err) {
        res.json({ message: err.message });
    }
});

router.get('/add',(req,res)=>{
    //res.send('HOME PAGE');
    res.render('Add_user',{title:'ADD USER'})
});

router.get('/edit/:id', (req, res) => {
    let id = req.params.id;

    User.findById(id)
        .exec()
        .then((user) => {
            if (!user) {
                res.redirect('/');
            } else {
                res.render('edit', {
                    title: "Edit User",
                    user: user,
                });
            }
        })
        .catch((err) => {
            console.error(err);
            res.redirect('/');
        });
});
//update user route 
router.post("/update/:id", upload, (req, res) => {
    let id = req.params.id;
    let new_image = '';

    if (req.file) {
        new_image = req.file.filename;
        try {
            fs.unlinkSync("./upload/" + req.body.old_image);
        } catch (err) {
            console.log(err);
        }
    } else {
        new_image = req.body.old_image;
    }

    User.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: new_image,
        })
        .exec()
        .then((result) => {
            req.session.message = {
                type: 'success',
                message: 'User updated successfully',
            };
            res.redirect('/');
        })
        .catch((err) => {
            res.json({
                message: err.message,
                type: 'danger',
            });
        });
});
//delete user detail
router.get('/delete/:id', upload, (req, res) => {
    let id = req.params.id;

    User.findByIdAndDelete(id)
        .exec()
        .then((result) => {
            if (result && result.image != "") {
                try {
                    fs.unlinkSync('./upload/' + result.image);
                } catch (err) {
                    console.log(err);
                }
            }

            req.session.message = {
                type: "info",
                message: "User deleted successfully",
            };
            res.redirect("/");
        })
        .catch((err) => {
            res.json({
                message: err.message,
            });
        });
});


module.exports=router;