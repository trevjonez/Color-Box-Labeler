var gTextMargin = 10; //Margin between the bottom of the color block and the label
var PrecisionLength = 2; // How many decimal points on color channel values
var textSize = 4;


checkSelected();
writeLabels();

//Validate the selections to ensure they meet labeling criteria
function checkSelected() {
    var selectedObjects = app.activeDocument.selection;
    
    //Sanity Check: Ensure there is items selected
    if(selectedObjects.length == 0){
        Window.alert("Select the item(s) to color label");
        //$.write("No objects selected\n");
        return -1;
    }
    
    //Error precaution: Remove invalid items from selection set
    for( var obj in selectedObjects ) {
            if(selectedObjects[obj].typename != "PathItem"){
                //$.write( "Object number " + obj + " has been removed from selection due to invalid type: ");
                //$.writeln(selectedObjects[obj].toString());
                selectedObjects[obj].selected = false;
            }    
    }
    
    //Refresh our object array after removing the invalid items
    selectedObjects = app.activeDocument.selection;
    
    //Sanity Check: Ensure there is still items selected
     if(selectedObjects.length == 0){
        Window.alert("No eligible objects selected");
        //$.write("Wrong object types selected\n");
        return -1;
    }

    //QC Check: Ensure that the items being labeled are fairly normal
    if(!selectedObjects[0].closed){
            Window.alert("Error: Path must be closed");
            //$.write("Path not closed\n");
            return -1;
    }

     if(!selectedObjects[0].filled){
            Window.alert("Error: Path must be filled");
            //$.write("Path not filled\n");
            return -1;
    }
    //QC Check END
}


// Loop over selected items and put a colorText label on them
function writeLabels() {
    var selectedObjects = app.activeDocument.selection;

    try{
        var charStyle = app.activeDocument.characterStyles.getByName("Label");
    } catch(err) {
        var charStyle = app.activeDocument.characterStyles.add("Label");
    }
    var charAtter = charStyle.characterAttributes;
    charAtter.size = 120;
            
    for( var obj in selectedObjects ) {
            var x_chord = selectedObjects[obj].position[0];
            var y_chord = selectedObjects[obj].position[1] - selectedObjects[obj].height - gTextMargin;
        
            var colorText = app.activeDocument.textFrames.add(); //create the colorText label and make it look right
            colorText.position = [x_chord , y_chord]; 
            colorText.contents = getColorText(selectedObjects[obj] , obj);
            var bounds = selectedObjects[obj].geometricBounds;
            //$.write(bounds + "\n");
            var width = bounds[2]-bounds[0];
            width = Math.abs(width);
            textSize = width * (4 / 78);
            if(textSize < charAtter.size){
                charAtter.size = textSize;
            }            
            charStyle.applyTo(colorText.textRange);
    } 

    app.activeDocument.characterStyles.removeAll();

}

// Lookup and return the color label depending on the fill color type
function getColorText(currentObj, count) {
    
    count++; // Shift the count up by one so that its more readable
    var resultText = count.toString() + ": ";
    
    if(currentObj.fillColor.typename == "SpotColor"){
        
        resultText += currentObj.fillColor.spot.toString() + " α[";
        resultText += currentObj.opacity.toFixed(PrecisionLength).toString()  + "]";
        
    } else if(currentObj.fillColor.typename == "CMYKColor"){
        
        resultText += " C[" + currentObj.fillColor.cyan.toFixed(PrecisionLength).toString()  + "]";
        resultText += " M[" + currentObj.fillColor.magenta.toFixed(PrecisionLength).toString()  + "]";
        resultText += " Y[" + currentObj.fillColor.yellow.toFixed(PrecisionLength).toString()  + "]";
        resultText += " K[" + currentObj.fillColor.black.toFixed(PrecisionLength).toString()  + "]";
        resultText += " α[" + currentObj.opacity.toFixed(PrecisionLength).toString()  + "]";
        
    } else if(currentObj.fillColor.typename == "RGBColor"){
        
        resultText += " R[" + currentObj.fillColor.red.toFixed(PrecisionLength).toString()  + "]";
        resultText += " G[" + currentObj.fillColor.green.toFixed(PrecisionLength).toString()  + "]";
        resultText += " B[" + currentObj.fillColor.blue.toFixed(PrecisionLength).toString()  + "]";
        resultText += " α[" + currentObj.opacity.toFixed(PrecisionLength).toString()  + "]";
        
    } else if(currentObj.fillColor.typename == "LabColor"){
        
        resultText += " L[" + currentObj.fillColor.l.toFixed(PrecisionLength).toString()  + "]";
        resultText += " A[" + currentObj.fillColor.a.toFixed(PrecisionLength).toString()  + "]";
        resultText += " B[" + currentObj.fillColor.b.toFixed(PrecisionLength).toString()  + "]";
        resultText += " α[" + currentObj.opacity.toFixed(PrecisionLength).toString()  + "]";
        
    } else if(currentObj.fillColor.typename == "GrayColor"){
        
        resultText += " K[" + currentObj.fillColor.gray.toFixed(PrecisionLength).toString()  + "]";
        resultText += " α[" + currentObj.opacity.toFixed(PrecisionLength).toString()  + "]";
        
    } else if(currentObj.fillColor.typename == "GradientColor"){
        
        resultText += "Gradients not supported";
        
    }  else if(currentObj.fillColor.typename == "NoColor"){
        
        resultText += "No Color";
        
    }   else if(currentObj.fillColor.typename == "PatternColor"){
        
        resultText += "Pattern fill not supported";
        
    } 

    return resultText;
}



