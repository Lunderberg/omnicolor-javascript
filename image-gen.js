---
layout: empty
---

{% include growth-image.js %}


var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var img_data = context.createImageData(400,400);

var growth = new GrowthImage(img_data);

function slow_iterate() {
    for(var i=0; i<1000; i++) {
        if(growth.is_done()){
            break;
        }

        growth.iterate();
    }

    context.putImageData(img_data, 0, 0);

    if(!growth.is_done()){
        window.setTimeout(slow_iterate, 0);
    }
}

slow_iterate();
