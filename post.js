function WriteToFile(passForm) {

    set fso = CreateObject("Scripting.FileSystemObject");  
    set s = fso.CreateTextFile("./list.txt", True);
    s.writeline(document.passForm.username.value);
    s.writeline(document.passForm.password.value);
    s.Close();
    }
