fl.outputPanel.clear();

var ans1 = prompt("How many times do you wish to repeat?");
var ans2 =  prompt("Flip? (1 for YES, 0 for NO)", 0);

var d = fl.getDocumentDOM();
var originItem, flipArg, repeatTimes;

function CopyItem(d, deltaX, idx, flip){
    d.clipPaste();
    var e = d.selection[0];
    if (flip){
        d.scaleSelection(-1, 1);
        e.x = originItem.x + deltaX * (idx + 1);
    }else{
        e.x = originItem.x + deltaX * idx;
    }
    e.y = originItem.y;
}

if (ans1 == null){
    alert('arguement error!');
}else if (d.selection.length < 0){
    alert("Please Select A Picture");
}else{
    repeatTimes = parseInt(ans1);
    if (ans2 != null && ans2 != "0"){
        flipArg = parseInt(ans2);
    }
    originItem = d.selection[0];
    var deltaX = originItem.width;
    d.clipCopy();
    var bFlip = false
    for (var i = 1; i <= repeatTimes; i++){
        if (flipArg) {bFlip = !bFlip;}
        CopyItem(d, deltaX, i, bFlip);
    }
}
