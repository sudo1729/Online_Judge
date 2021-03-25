
// Requirements

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { log } = require("console");
const cp = require("child_process");
const fs = require("fs");
const stripFinalNewline = require('strip-final-newline');

const app=express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



//GET Request


app.get("/",function(req,res){
    res.render("home",{input:null,code:null,recieved:null,verdict:null,expected:null});
})


//POST Request here
var expectedOriginal=""

app.post("/",function(req,res){
    console.log(req.body);
    var code = req.body.code;
    expectedOriginal = stripFinalNewline(req.body.expected);
    var expected = stripFinalNewline(req.body.expected).split(/\r?\n/);
    // fs.writeFileSync('expected.txt',expected,function(err){
    //     if(err)
    //         console.log(err);
    // })
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
    var verdict="Runtime Error";
    fs.writeFileSync('input.txt', input, function (err) {
        if (err) console.log(err);
        //console.log('Saved!');
    });
    if(req.body.language=="Python"){
        try{
            cp.execSync("python test.py<input.txt>output.txt",{timeout:5000});
        }
        catch(e){
            error=String(e.stderr);
            //console.log("Error has occurered it is:"+error);
            if(e.signal=="SIGTERM"){
                verdict="TLE"
            }
        }
        
    }
    else{
        try{
            cp.execSync("g++ test.cpp" ,{timeout:5000},function(err,stderr){
                console.log("The error is "+err);
                console.log("The error is "+stderr);
            });
            cp.execSync("./a.out<input.txt>output.txt",);
        }
        catch(e){
            error=String(e.stderr);
            //console.log("Error has occurered it is:"+error);
            if(e.signal=="SIGTERM"){
                verdict="TLE"
            }
        }
        
    }
    let recievedOriginal = ""
    if(error!==null){
        recievedOriginal=error;
    }
    
    else{
        recievedOriginal = stripFinalNewline(fs.readFileSync("output.txt")).toString('utf8');
        recieved = stripFinalNewline(fs.readFileSync("output.txt")).toString('utf8').split(/\r?\n/);
        // expected = stripFinalNewline(fs.readFileSync("expected.txt")).toString('utf8');
        //console.log(recieved);
        //console.log(expected);
        if(JSON.stringify(recieved)===JSON.stringify(expected)){
            verdict="AC"
        }
        else{
            verdict="WA"
        }
        
    }
    
    res.render("home",{input:input,code:code,recieved:recievedOriginal,expected:expectedOriginal,verdict:verdict});
      
})


app.listen(3000,function(){
    console.log("server started at port 3000");
})