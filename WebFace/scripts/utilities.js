//fits point in a showing canvas
function scale(point, minx, miny, maxx, maxy, width, height){
    point.x = (point.x-minx)/(maxx-minx)*width;
    point.y = (-point.y-miny)/(maxy-miny)*height;
}
//fits coords in a canvas
function scaleCoord(x, minx, maxx, width){
    return (x-minx)/(maxx-minx)*width;
}

function updateValue(id, value){
    document.getElementById(id).innerText = value;
}

function convertToInt(colorHex){
    if(colorHex.length !== 7){return 0;}
    let R = colorHex.substring(1, 3);
    let G = colorHex.substring(3, 5);
    let B = colorHex.substring(5, 7);

    return [parseInt(R,16),parseInt(G,16),parseInt(B,16)];
}

function getColor(color1, color2, position){
    const color1Multiplier = position;
    const color2Multiplier = 1-position;
    let finalRGB = [];
    for (let i =0; i < 3; i++){
        let firstPart = color1[i] * color1Multiplier;
        let secondPart = color2[i] * color2Multiplier;
        finalRGB.push(parseInt(firstPart + secondPart).toString(16));
    }
    return finalRGB
}

function colorToString(RGB){
    let str = '#';
    for ( let i = 0; i < 3; i++){
        let sRGB = RGB[i].toString();
        if (sRGB.length === 1)
            sRGB = '0'+sRGB;
        str = str + sRGB;
    }
    return str;
}