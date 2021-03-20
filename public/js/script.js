var editor = ace.edit('editor');
editor.setTheme("ace/theme/tomorrow");
var cpp = $("#cpp");
var python = $("#python")
var language = $('input[name="language"]');
editor.getSession().setMode("ace/mode/c_cpp");

var snippetCnt = 0

cpp.click(function(){
    editor.getSession().setMode("ace/mode/c_cpp");
    language.val("cpp")
    if(snippetCnt===0){
        var snippet = "#include<bits/stdc++.h>\nusing namespace std;\n\nint main(){\n\nreturn 0;\n}";
        var snippetManager = ace.require("ace/snippets").snippetManager;
        snippetManager.insertSnippet(editor, snippet);
        snippetCnt++;
    }
    
    cpp.css("background-color","green");
    python.css("background-color","rgb(53, 53, 206)");
})
python.click(function(){
    editor.getSession().setMode("ace/mode/python");
    language.val("Python")
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

