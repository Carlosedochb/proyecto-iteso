const width = 320;
const height = 240;

let uploadedimage = null;
let isselectingcolor=false;

const downloadButton = $('#download-button');
const selectedColor= $('#selected-color');
const redslider = $('#red-slider');
const greenslider = $('#green-slider');
const blueslider = $('#blue-slider');
const toleranceSlider=$('#tolerance-slider')
const presetSelect = $('#preset-select');

let scr=0, scg=0, scb=0;
function setup() {
    createCanvas(width, height).parent('canvas-container');
    pixelDensity(1);

    const htmldropzone = select("#dropzone");
    htmldropzone.dragOver(function(){
        htmldropzone.addClass("dragOver");
    });
    htmldropzone.dragLeave(function(){
        htmldropzone.removeClass("dragOver");
    });
    htmldropzone.drop(function(image){
        uploadedimage= loadImage(image.data);
        
        htmldropzone.removeClass("dragOver");
    });
}
  
function draw() {
    background(100,0);
   // console.log(mouseincanvas());
    if (uploadedimage === null) return;

    let canvasratio = width/height;

    let imagewidth = uploadedimage.width;
    let imageheight = uploadedimage.height;
    let imageratio = imagewidth/imageheight;

    let x=0,y=0,w,h;

    if (imageratio > canvasratio){
        w = width;
        h = w/imageratio;
        y = (height - h)/2;
    }
    else{
        h = height;
        w = imageratio * h;
        x = (width - w)/2;
    }

    image(uploadedimage,x,y,w,h);

    // filters

    loadPixels();

    if(isselectingcolor && mouseincanvas()){
        x=Math.round(mouseX);
        y=Math.round(mouseY);
        let index =(y*width+x)*4;
        scr=pixels[index];
        scg=pixels[index+1];
        scb=pixels[index+2];
        selectedColor.css('background-color', `rgb(${scr}, ${scg}, ${scb})` )
    }

    if(presetSelect.val() === 'grayscale') grayscale(pixels);
    if (presetSelect.val()==='sc')singleColor(pixels);
    else defaultpixels(pixels);
    
    updatePixels();    
}

downloadButton.click(function(){

    uploadedimage.loadPixels();

    let pixelBackup = [];
    for(let i=0; i < uploadedimage.pixels.length; i++){
        pixelBackup.push(uploadedimage.pixels[i]);
    }

    if(presetSelect.val() === 'grayscale') grayscale(uploadedimage.pixels);
    else defaultpixels(uploadedimage.pixels);
    

    uploadedimage.updatePixels();

    save(uploadedimage, 'edit.png');

    uploadedimage.loadPixels();

    for(let i=0; i < uploadedimage.pixels.length; i++){
        uploadedimage.pixels[i] = pixelBackup[i];
    }

    uploadedimage.updatePixels();
});

selectedColor.click(function(){
    isselectingcolor=true;
});

function mouseClicked(){
    if (mouseincanvas()) isselectingcolor=false;
}
function mouseincanvas(){
    if(mouseX>=0 && mouseX<=width && mouseY>=0 && mouseY<=height)return true;
    else return false;
}

//// filtros2.0 ////
function singleColor(pixels){
    for(let pixel=0; pixel < pixels.length/4; pixel++){
        let i = pixel*4;
        let tolerance = Number(toleranceSlider.val()); 
        let difference = Math.abs(pixels[i]-scr)+Math.abs(pixels[i+1]-scg)+Math.abs(pixels[i+2]-scb);
        if(difference< tolerance) continue;

        let average = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
        pixels[i+0] = average;
        pixels[i+1] = average;
        pixels[i+2] = average;
    }
}

function grayscale(pixels){
    for(let pixel=0; pixel < pixels.length/4; pixel++){
        let i = pixel*4;
        let average = (pixels[i] + pixels[i+1] + pixels[i+2]) / 3;
        pixels[i+0] = average;
        pixels[i+1] = average;
        pixels[i+2] = average;
    }
}

function defaultpixels(pixels){
    let r= Number(redslider.val());
    let g= Number(greenslider.val());
    let b= Number(blueslider.val());
    for(let pixel=0; pixel < pixels.length/4; pixel++){
        let i = pixel*4;
        pixels[i+0] = pixels[i+0] + r;
        pixels[i+1] = pixels[i+1] + g;            
        pixels[i+2] = pixels[i+2] + b;
    }
}
