//bring Photoshop above all windows 
app.bringToFront()

//save original units to restore them in the end
var originalRulerUnits = app.preferences.rulerUnits
//set the ruler units to pixels
app.preferences.rulerUnits = Units.PIXELS

//you should replace path to yours
var pathToFile = "C:/Users/terof/Desktop/copyrightwhite.psd"

//get a reference to the file that we want to open 
var fileRef = File(pathToFile)

//if file does not exits tell user 
if (!fileRef.exists) {
    alert(fileRef.name + " does not exist!")
} else {

    app.open(fileRef)

    var docWatermark = activeDocument

    //save watermark width and height
    var watermarkWidth = docWatermark.width
    var watermarkHeight = docWatermark.height

    //you should replace layer name to yours
    var layerName = "yui lang photography"
    //copy watermark layer by its name
    docWatermark.artLayers[layerName].copy()

    //close watermark file
    app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)

    //you should replace this value to yours
    var biggestSidePx = 1500

    //use the length property of the documents object to 
    //find out if any documents are open
    //if none are found, alert done
    while (app.documents.length !== 0) {

        var docPhoto = activeDocument

        //resize to the biggest side to the amount you set above
        if (docPhoto.width > docPhoto.height) {
            docPhoto.resizeImage(biggestSidePx, undefined, 300, ResampleMethod.BILINEAR)
        } else {
            docPhoto.resizeImage(undefined, biggestSidePx, 300, ResampleMethod.BILINEAR)
        }

        //paste the watermark
        docPhoto.paste()

        //resize watermark
        var widthResizePercent = 30
        var heightResizePercent = 30
        activeDocument.activeLayer.resize(widthResizePercent, heightResizePercent, AnchorPosition.MIDDLECENTER)

        //calculate the distance between current watermark position (in the middle of the photo) and bottom of the photo 
        var halfPhotoHeight = docPhoto.height / 2
        //translate resize percent to decimal
        var heightResize = heightResizePercent / 100

        //calculate new watermark coordinates, 
        //correct Y coordinate for half of the watermark height
        //(as the anchor is set at the middle center of the watermark) 
        //to make all the content visible
        var newWatermarkX = (docPhoto.width * 0)
        var newWatermarkY = (halfPhotoHeight - watermarkHeight * heightResize / 2)

        // move watermark layer at the bottom center
        activeDocument.activeLayer.translate(newWatermarkX, newWatermarkY)

        //save as jpg
        var docRef = app.activeDocument
        var jpgName = docRef.name
        var savePath = docRef.path

        var fileLocation = File(savePath + "/" + "resized_" + jpgName)

        jpgSaveOptions = new JPEGSaveOptions()
        jpgSaveOptions.embedColorProfile = true
        jpgSaveOptions.formatOptions = FormatOptions.STANDARDBASELINE
        jpgSaveOptions.matte = MatteType.NONE
        jpgSaveOptions.quality = 12

        docRef.flatten()

        //works with sRGB only. Otherwise displays dialog window
        app.activeDocument.saveAs(fileLocation, jpgSaveOptions, true, Extension.LOWERCASE)
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES)
    }

    alert("Done!")
}

//restore unit settings 
app.preferences.rulerUnits = originalRulerUnits