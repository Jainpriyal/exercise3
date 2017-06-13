/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel

// shade the passed axis aligned rectangle
// assumes that the sides are all axis aligned — more logic needed for tris
// assumes vertices all have same number of attribs
// assumes object properties have clone, subtract, scale and add methods
// accepts the imagedata to write to
// accepts top, bottom, left, right coords for rect
// accepts an array of vertex attribs to interpolate
// modifies passed image data
function interpRect(imagedata,top,bottom,left,right,tlAttribs,trAttribs,brAttribs,blAttribs) {
    
    // shade the pixel given pixel position and interp'd attribs
    // assumes attribs contains a "diffuse" property which is a Color object
    // assumes all other properties are floats
    // modifies pass image data
    function shadePixel(imagedata,pixX,pixY,attribs) {
        drawPixel(imagedata,pixX,pixY,attribs.diffuse);
    } // end shade pixel
    
    try {
        if (   (typeof(tlAttribs) !== "object") || (typeof(trAttribs) !== "object")
            || (typeof(brAttribs) !== "object") || (typeof(blAttribs) !== "object"))
            throw "InterpRect: passed attributes are not objects";
        else {
            let tlSize = Object.keys(tlAttribs).length, trSize = Object.keys(trAttribs).length;
            let brSize = Object.keys(brAttribs).length, blSize = Object.keys(blAttribs).length;
            if ((tlSize !== trSize) || (tlSize !== brSize) || (tlSize !== blSize))
                throw "InterpRect: passed attributes have different numbers of properties";
            else { // passed attribute checks
                
                // set up the vertical interpolation
                var la = JSON.parse(JSON.stringify(tlAttribs));  // left attribs stringify to support deep cloning
                var ra = JSON.parse(JSON.stringify(trAttribs));  // right attribs
                var vDelta = 1 / (bottom-top); // norm'd vertical delta
                var laDelta = {}, raDelta = {}; // left and right attribute deltas
                for (var a in tlAttribs)
                    if (typeof(tlAttribs.a) == "number") {
                        laDelta.a = vDelta * (blAttribs.a - tlAttribs.a);
                        raDelta.a = vDelta * (brAttribs.a - trAttribs.a);
                    } else { // assume attrib is an object
                        console.log(blAttribs[a].constructor.name);
                        laDelta.a = blAttribs[a].clone().subtract(tlAttribs[a]).scale(vDelta);
                        raDelta.a = brAttribs[a].clone().subtract(trAttribs[a]).scale(vDelta);
                    } // end if attrib is an object

                // set up the horizontal interpolation
                var ha = {}, haDelta = {}; // horizontal color and delta
                var hDelta = 1 / (right-left); // norm'd horizontal delta

                // do the interpolation
                for (var y=top; y<=bottom; y++) { // for pixel row
                    ha = JSON.parse(JSON.stringify(la)); // begin with the left color
                    for (var a in ha)
                        if (typeof(ha.a) == "number")
                            haDelta.a = hDelta * (ra.a - la.a);
                        else // assume attrib is object
                            haDelta.a = ra.a.clone().subtract(la.a).scale(hDelta);
                    for (var x=left; x<=right; x++) { // for each pixel column
                        shadePixel(imagedata,x,y,ha);
                        for (var a in ha)
                            if (typeof(ha.a) == "number")
                                ha.a += haDelta.a;
                            else // assume attrib is object
                                ha.a.add(haDelta.a);
                    } // end for each pixel row
                    for (var a in la)
                        if (typeof(la.a) == "number") {
                            la.a += laDelta.a; ra.a += raDelta.a;
                        } else {
                            la.a.add(laDelta.a); ra.a.add(raDelta.a);
                        } // end if assume object
                } // end for each pixel row
                
            } // end if passed attribute checks
        } // end if all passed attributes are object
    } // end try
    
    catch(e) {
        console.log(e);
    } // end catch
} // end interpRect
    

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);
 
    // Define a rectangle in 2D with colors and coords at corners
    var tlAttribs = { diffuse: new Color(255,0,0)};
    var trAttribs = { diffuse: new Color(0,255,0)};
    var brAttribs = { diffuse: new Color(0,0,255)};
    var blAttribs = { diffuse: new Color(0,0,0)};
    interpRect(imagedata,50,150,50,200,tlAttribs,trAttribs,brAttribs,blAttribs);
    context.putImageData(imagedata,0,0); // display the image in the context
} // end main
