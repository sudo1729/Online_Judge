var emptyString=""
var editor = ace.edit('editor');
editor.setTheme("ace/theme/dracula");
var cpp = $("#cpp");
var python = $("#python")
var language = $('input[name="language"]');
editor.getSession().setMode("ace/mode/c_cpp");

var snippetCnt = false

cpp.click(function(){
    editor.getSession().setMode("ace/mode/c_cpp");
    language.val("cpp")
    //alert(editor.getSession().getValue());
    if(!snippetCnt){
        var snippet = "#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n\nreturn 0;\n}";
        var snippetManager = ace.require("ace/snippets").snippetManager;
        snippetManager.insertSnippet(editor, snippet);
        snippetCnt=true
    }
    
    cpp.css("background-color","green");
    python.css("background-color","rgb(53, 53, 206)");
})
python.click(function(){
    editor.getSession().setMode("ace/mode/python");
    language.val("Python")
    // if(snippetCnt===true){

    // }
    python.css("background-color","green");
    cpp.css("background-color","rgb(53, 53, 206)");
})


editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});


var input = $('input[name="code"]');

editor.getSession().on("change", function () {
    input.val(editor.getSession().getValue());
});


