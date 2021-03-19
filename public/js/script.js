var editor = ace.edit('editor');
let arr=[]
if($('input[value="C++"]:checked').val())
    console.log("C++");
if($('input[value="Python"]:checked').val())
    console.log("Python");
var selected=String($('input[name="language"]:checked').val());
arr.push(selected)


console.log(arr);
// if(selected=="Python"){
//     editor.getSession().setMode("ace/mode/python");
// }
// else{
//     editor.getSession().setMode("ace/mode/c_cpp");
// }

ace.require("ace/ext/language_tools");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true
});

editor.setTheme("ace/theme/monokai");


var input = $('input[name="code"]');

editor.getSession().on("change", function () {
    input.val(editor.getSession().getValue());
});
