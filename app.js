
// Requirements

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



//GET Request


app.get("/",function(req,res){
    res.render("home",{input:null,code:null,recieved:null,verdict:null,expected:null});
})


//POST Request here


app.post("/",function(req,res){
    console.log(req.body);
    var code = req.body.code;
    var expected = req.body.expected
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
    var error = null;
    fs.writeFileSync('input.txt', input, function (err) {
        if (err) console.log(err);
        //console.log('Saved!');
    });
    if(req.body.language=="Python"){
        try{
            cp.execSync("python test.py < input.txt > output.txt")
        }
        catch(e){
            error=String(e.stderr);
        }
        
    }
    else{
        try{
            cp.execSync("g++ test.cpp" ,function(err,stderr){
                console.log("The error is "+err);
                console.log("The error is "+stderr);
            });
            cp.execSync("./a.out < input.txt > output.txt");
        }
        catch(e){
            error=String(e.stderr);
            console.log("Error has occurered it is:");
            //console.log(String(e.stderr));
        }
        
    }
    
    var verdict = null;
    if(error!==null){
        recieved=error
        verdict="RE"
    }
    
    else{
        recieved = String(fs.readFileSync("output.txt"));
        if(recieved==expected){
            verdict="AC"
        }
        else{
            verdict="WA"
        }
    }
        
    res.render("home",{input:input,code:code,recieved:recieved,expected:expected,verdict:verdict});
      
})


app.listen(3000,function(){
    console.log("server started at port 3000");
})