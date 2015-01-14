var folderURI = fl.browseForFolderURL('select a folder which you want to search in');
var ToFind = prompt("the name you want to search", "")
if (ToFind == null){
    alert("You can't leave the name for empty");
}else{
	batToDo(folderURI);
}

function batToDo(folderURI) {
    fl.showIdleMessage(false)
    fl.closeAll(false)
    var files = FLfile.listFolder(folderURI + "/*.fla", "files");
    for (var i = 0; i < files.length; i++) {
        pub(folderURI, files[i]);
    }
    fl.showIdleMessage(true)
}

function pub(dir, file) {
    var t = dir + "/" + file
    var doc = fl.openDocument(t);
    var lib = fl.getDocumentDOM().library.items;
    for (var i = 0, len = lib.length; i < len; i++) {
        var item = lib[i];
        if (item.itemType == 'bitmap' && item.name == ToFind) {
			fl.trace(t);
        }
    }
    doc.close(false);
}



