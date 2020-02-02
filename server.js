const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const session = require("express-session");
const cookieParser = require("cookie-parser");

app.use(express.static('public'))

app.use(cookieParser());
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "EiEi Test my Session", // ตัว unique รหัสที่ session จะนำไปใช้ในการถอดค่ามาอ่าน
    cookie: {
      maxAge: 1000 * 60 * 60, // ตั้งเวลาของ session โดยหน่วยเวลาเป็น Millisecond
    }
  })
);

app.use('/:file',(req,res)=>{
    if(req.params.file == "login"){
        return   res.sendFile(path.join(__dirname+"/public/"+ req.params.file+".html"));
    }
   else  res.sendFile(path.join(__dirname+"/public/"+ req.params.file));
});

router.get('/',function(req,res){
    console.log(path.join(__dirname+'/public/'+req))
  res.sendFile(path.join(__dirname+'/public/'+req));
});

app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');