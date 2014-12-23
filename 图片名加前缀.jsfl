    var lib = fl.getDocumentDOM().library.items;

    var replacedArr = [];
    for(m = 0; m<lib.length; m++){
        var f = lib[m];
        var name = f.name;
        if (name.indexOf("png") > 0)
        {
            fl.trace(f.name);
            f.name = "g_" + f.name;
        }
    }
