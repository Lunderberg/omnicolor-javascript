---
layout: empty
---

{% include growth-image.js %}


var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
var img_data = context.createImageData(100,100);

var growth = new GrowthImage(img_data);

context.putImageData(img_data, 0, 0);
