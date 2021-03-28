
// Requirements

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { log } = require("console");
const cp = require("child_process");
const fs = require("fs");
const stripFinalNewline = require('strip-final-newline');
const mongoose = require("mongoose");
var url = require('url');
const Schema = mongoose.Schema;

//App
const app=express();

//Setting App
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public/"));



mongoose.connect("mongodb://localhost/codeDB", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var urlSchema = new Schema({
    baseUrl:String,
    input: String,
    expected: String,
    recieved: String,
    code: String,
    verdict: String,
    language:String
});

const userCode = mongoose.model("userCode",urlSchema);


// //GET Request

app.get("/home",function(req,res){
    res.render("home",{input:null,code:null,recieved:null,verdict:null,expected:null,language:null});
});

app.get("/home/:version",function(req,res){
    //console.log(req.params);
    var requestedUrl = req.params.version;
    userCode.find({baseUrl:req.params.version}).exec(function(err,data){
        //console.log(data);
        if(err){
            console.log("Error Occured");
        }
        if(data.length===0){
            console.log("Requested url "+requestedUrl+" not found! redirecting to home page !");
            // res.render("home",{input:null,code:null,recieved:null,verdict:null,expected:null});
            res.redirect("/home");
        }
        else{
            console.log("Requested url "+ requestedUrl +" found! rendering requested page !");
            res.render("newPage",data[0])
        }
    });
     
});


// //POST Request here

var recieved = null, expected = null, input = null, verdict = null, code = null, language = null, error = null;

// app.param('version',function(req,res,next,version){
//     if(version!=="0")
//         next();
// })


function runCommand(){
    var cmd = null;
    if(language=="Python"){
        //cmd = "python code.py<input.txt>recieved.txt";
        cmd = "python3 "+__dirname+"/code/python/code.py"+"<"+__dirname+"/io/input.txt"+">"+__dirname+"/io/recieved.txt";
        try{
            cp.execSync(cmd,{timeout:5000});
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
        cmd = "cd "+__dirname+"/code/cpp/ && g++ code.cpp";
        try{
            cp.execSync(cmd ,{timeout:5000},function(err,stderr){
                console.log("The error is "+err);
                console.log("The error is "+stderr);
            });

            cmd = "cd "+__dirname+"/code/cpp/ && "+"./a.out"+"<"+__dirname+"/io/input.txt"+">"+__dirname+"/io/recieved.txt";
            cp.execSync(cmd);
        }
        catch(e){
            error=String(e.stderr);
            //console.log("Error has occurered it is:"+error);
            if(e.signal=="SIGTERM"){
                verdict="TLE"
            }
        }
    }
    var path = __dirname+"/io/recieved.txt";
    if(error!==null)
        recieved = error;
    else
        recieved = stripFinalNewline(fs.readFileSync(path)).toString('utf8');
    
};

function getExpected(val){
    expected = stripFinalNewline(val).toString('utf8');
    //console.log(expected);
    var path = __dirname+"/io/expected.txt";
    fs.writeFileSync(path,expected,function(err){
        if(err){
            console.log(err);
        }
    });
};

function getInput(val){
    input = val;
    //console.log(input);
    var path = __dirname+"/io/input.txt";
    fs.writeFileSync(path,input,function(err){
        if(err){
            console.log(err);
        }
    });
};

function getCode(val){
    code = val;
    var path = __dirname+"/code/";
    if(language=="Python"){
        path+="python/code.py";    
    }
    else{
        path+="cpp/code.cpp";
    }
    fs.writeFileSync(path,code,function(err){
        if(err)
            console.log(err);
    });
};

function getEvaluation(){
    if(JSON.stringify(stripFinalNewline(expected).toString('utf8').split(/\r?\n/))===JSON.stringify(stripFinalNewline(recieved).toString('utf8').split(/\r?\n/))){
        verdict="AC";
    }
    else{
        verdict="WA";
    }
}




app.post("/home",function(req,res){
    language = req.body.language;
    //input
    getInput(req.body.input);

    //Expected
    getExpected(req.body.expected);

    //Code
    getCode(req.body.code);

    //Run
    runCommand();

    //Eval
    if(error === null)
        getEvaluation();
    else
        verdict = "RE";

    var randomValue = String(Math.floor((Math.random() * 100) + 1))+String(Math.floor((Math.random() * 100) + 1));
    var url_instance = {
        baseUrl:randomValue,
        input:input,
        expected:expected,
        recieved:recieved,
        code:code,
        verdict:verdict,
        language:language
    };
    //console.log(url_instance);
    userCode.create(url_instance).then(function(err){
        if(err)
            console.log(err);
        else{
            console.log("Successful insertion");
            console.log("Generated url is : "+randomValue);
        }
            
    });
    res.redirect('/home/'+randomValue);
    //res.render("home",{input:input,code:code,recieved:recieved,expected:expected,verdict:verdict});
      
});

app.post("/home/:version",function(req,res){
    language = req.body.language;
    //input
    getInput(req.body.input);

    //Expected
    getExpected(req.body.expected);

    //Code
    getCode(req.body.code);

    //Run
    runCommand();

    //Eval
    if(error === null)
        getEvaluation();
    else
        verdict = "RE";

    
    //console.log(url_instance);
    userCode.updateOne({baseUrl:req.params.version},{
        baseUrl:req.params.version,
        input:input,
        expected:expected,
        recieved:recieved,
        code:code,
        verdict:verdict,
        language:req.body.language
    },function(err){
        if(err)
            console.log("error updating database");
        else{
            console.log("successfull updation");
        }
            
    });
    res.redirect('/home/'+req.params.version);
})



app.listen(3000,function(){
    console.log("server started at port 3000");
})