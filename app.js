const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { log } = require("console");
const cp = require("child_process");
const fs = require("fs");

const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/",function(req,res){
    res.render("home",{input:null,code:null,result:null});
})

app.post("/",function(req,res){
    //console.log(req.body);
    var code = req.body.code;
    if(req.body.language=="Python"){
        fs.writeFileSync('test.py',code,function(err){
            if(err)
                console.log(err);
        })
    }
    else{
        fs.writeFileSync('test.cpp',code,function(err){
            if(err)
                console.log(err);
        })
    }
    
    var input = String(req.body.input);
    var error = false;
    fs.writeFileSync('input.txt', input, function (err) {
        if (err) console.log(err);
        //console.log('Saved!');
    });
    if(req.body.language=="Python"){
        try{
            cp.execSync("python test.py < input.txt > output.txt")
        }
        catch(e){
            error=true;
        }
        
    }
    else{
        try{
            cp.execSync("g++ test.cpp");
            cp.execSync("./a.out < input.txt > output.txt");
        }
        catch(e){
            error=true;
            //console.log("Some error occured")
        }
        
    }
    
    if(error===true)
        result="There's some problem in your code."
    else
        result = String(fs.readFileSync("output.txt"));
    res.render("home",{input:input,code:code,result:result});
      
})


app.listen(3000,function(){
    console.log("server started at port 3000");
})