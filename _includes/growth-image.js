{% include gen-palette.js %}

var GrowthImage = function(img_data) {
    this.img_data = img_data;
    this.palette = gen_palette(img_data.data.length/4);
    this.ClearImage();
}

GrowthImage.prototype.ClearImage = function() {
    for(var i=0; i<this.width; i++){
        for(var j=0; j<this.height; j++){
            var color = this.palette[i + j*this.width];
            this.set_pixel(i, j, color.r, color.g, color.b, 255);
        }
    }
}

GrowthImage.prototype.set_pixel = function(i, j, r, b, g, a) {
    var index = 4*(j*this.width + i);
    this.img_data.data[index+0] = r;
    this.img_data.data[index+1] = g;
    this.img_data.data[index+2] = b;
    this.img_data.data[index+3] = a;
}

Object.defineProperty(GrowthImage.prototype, "width", {
    get: function width() {
        return this.img_data.width;
    }
});

Object.defineProperty(GrowthImage.prototype, "height", {
    get: function height() {
        return this.img_data.height;
    }
});
