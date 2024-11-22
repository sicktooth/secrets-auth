const express = require("express");
const PORT = 3000;
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));






app.listen(PORT, ()=>{
    console.log('server started at localhost:'+PORT);
    
})