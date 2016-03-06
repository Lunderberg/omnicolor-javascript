---
layout: empty
---

{% include growth-image.js %}

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var img_data = context.createImageData(canvas.width,canvas.height);

var status_box = document.getElementById("status");
var t_start = window.performance.now();
var t_end = t_start;

var growth = new GrowthImage(img_data);

function slow_iterate() {
    for(var i=0; i<1000; i++) {
        if(growth.is_done()){
            break;
        }

        growth.iterate();
    }

    context.putImageData(img_data, 0, 0);

    t_end = window.performance.now();
    status_box.innerHTML = "Runtime: " + ((t_end - t_start)/1000).toFixed(1) + " sec";

    if(!growth.is_done()){
        window.setTimeout(slow_iterate, 0);
    }
}

window.onload = slow_iterate;
