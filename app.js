const express = require("express");
const PORT = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');
const {connectDB, User} = require('./config/database')

connectDB();
app.get('/', (req, res)=>{
    res.render('home');
})

app.get('/login', (req, res)=>{
    res.render('login');
})

app.get('/register', (req, res)=>{
    res.render('register');
})

app.post('/register', async (req, res)=> {
    try {
        const newUser = await User.create({
                email: req.body.username,
                password: req.body.password
        });
        if (newUser){
            console.log("Successfully add new user");
            res.render('secrets')
        } else {
            res.status(401).send({
                message: "unauthorized"
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: "internal server error",
            error: error.message, error
        })
    }
   
})

app.post("/login", async (req, res)=>{
    const userName = req.body.username,
    password = req.body.password;
    try {
        const foundUser = await User.findOne({email: userName});
        if(foundUser){
            if(foundUser.password === password){
                res.render('secrets')
            }
        } else {
            res.status(404).send({
                message: "User not found please register"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "internal server error",
            error: error.message, error
        })
    }
})

app.listen(PORT, ()=>{
    console.log('server started at localhost:'+PORT);
    
})