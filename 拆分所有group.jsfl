// Copyright (C) 2009 Moccu GmbH & Co. KG, Pappelalle 10, 10437 Berlin, Germany

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in 
// the Software without restriction, including without limitation the rights to 
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
// of the Software, and to permit persons to whom the Software is furnished to 
// do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// Author(s):   Andreas Hug
// Version:     1.0
// Date:        18.06.2009


run();


//  //  //  //  OBJECTS  //  //  //  //

/**
 * Constructor for KeyFrame objects
 * KeyFrame objects represent key frames which contain elements
 * @param symbol Item object which contains the KeyFrame
 * @param layer Layer oject which contains the KeyFrame
 * @param frame Frame object which is the KeyFrame
 */
function KeyFrame(symbol, layer, frame)
{
    this.symbol = symbol;
    this.layer = layer;
    this.frame = frame;
    
    this.toString = function()
    {
        return this.symbol.name + " (" + this.symbol.itemType + ") layer: " + this.layer.name + ", frame: " + this.frame.startFrame;
    }
    
}


//  //  //  //  METHODS  //  //  //  //

/**
 * Take all key frames and ungroup all elements
 */
function run()
{
    var symbols = getSymbols();
    var keyFrames = new Array();
    
    // key frames from library
    for(var i = 0; i < symbols.length; i++)
        keyFrames = keyFrames.concat(getKeyFrames(symbols[i])); 
    
    // key frames from main time line
    keyFrames = keyFrames.concat(getKeyFrames(null));
    
    for(var i = 0; i < keyFrames.length; i++)
        ungroupKeyFrame(keyFrames[i]);
        
    fl.getDocumentDOM().editScene(0);
}


/**
 * Scan the library for items of type "movie clip", "button" and "graphic"
 * @return array with all symbols
 */
function getSymbols()
{
    var libItems = fl.getDocumentDOM().library.items;
    var libSymbols = new Array();
    
    for(i = 0; i < libItems.length; i++)
    {
        if(libItems[i].itemType == "movie clip")
            libSymbols.push(libItems[i]);
        else if(libItems[i].itemType == "button")
            libSymbols.push(libItems[i]);
        else if(libItems[i].itemType == "graphic")
            libSymbols.push(libItems[i]);
    }
    
    return libSymbols;
}


/**
 * Get all key frames from a symbol
 * If symbol is null, the first scene's timeline is used instead
 * @param symbol Item object to get key frames from, null for first scene's timeline
 * @return Array with KeyFrame objects
 */
function getKeyFrames(symbol)
{
    var layers;
    var keyFrames = new Array();
    
    layers = symbol != null ? symbol.timeline.layers : fl.getDocumentDOM().getTimeline().layers;
    
    for(var i = 0; i < layers.length; i++)
    {
        var layer = layers[i];
        
        for(var j = 0; j < layer.frames.length; j++)
        {
            var frame = layer.frames[j];
            if(frame.startFrame == j)
            {
                var keyFrame = new KeyFrame(symbol, layer, frame);
                keyFrames.push(keyFrame);
            }
        }
    }
    return keyFrames;   
}


/**
 * Ungroup all Element objects in a key frame
 * @param keyFrame KeyFrame object containing the Element objects
 */
function ungroupKeyFrame(keyFrame)
{
    var locked = keyFrame.layer.locked;
    keyFrame.layer.locked = false;

    var elements = keyFrame.frame.elements
    for(var i = 0; i < elements.length; i++)
        if(elements[i].elementType == "shape")
            ungroupItemElement(keyFrame, elements[i]);
        
    keyFrame.layer.locked = locked;
}


/**
 * Ungroups an element even if the groups are nested
 * @param item Item object which contains the Element object
 * @param element Element object which may be a group
 */
function ungroupItemElement(keyFrame, element)
{
    if(element.elementType != "shape")
        return;
        
    element.locked = false;
    
    if(keyFrame.symbol != null)   // symbol key frame
    {
        fl.getDocumentDOM().library.editItem(keyFrame.symbol.name);
        keyFrame.symbol.timeline.currentFrame = keyFrame.frame.startFrame;
    } else                        // main time line key frame
    {
        fl.getDocumentDOM().editScene(0);
        fl.getDocumentDOM().getTimeline().currentFrame = keyFrame.frame.startFrame;
    }
    
    fl.getDocumentDOM().selectNone();
    fl.getDocumentDOM().selection = [element];
    
    if(fl.getDocumentDOM().selection[0] == undefined)
    {
        fl.getDocumentDOM().selectNone();
        fl.getDocumentDOM().selection = new Array();
        return;
    }

    if(fl.getDocumentDOM().selection[0].isGroup != true)
    {
        fl.getDocumentDOM().selectNone();
        fl.getDocumentDOM().selection = new Array();
        return;
    }
    
    fl.getDocumentDOM().unGroup();
    var ungrouped = fl.getDocumentDOM().selection;
    fl.getDocumentDOM().selectNone();
    
    for(var j = 0; j < ungrouped.length; j++)
        ungroupItemElement(keyFrame, ungrouped[j]); 
}

