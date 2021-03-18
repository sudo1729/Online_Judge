    var editor = ace.edit('editor');
        editor.session.setMode("ace/mode/c_cpp");
        editor.setTheme("ace/theme/monokai");

    var input = $('input[name="code"]');
        editor.getSession().on("change", function () {
        input.val(editor.getSession().getValue());
    });
