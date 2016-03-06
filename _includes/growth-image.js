{% include gen-palette.js %}
{% include gen-locations.js %}
{% include kd-tree.js %}

var GrowthImage = function(img_data) {
    this.img_data = img_data;
    this.width = img_data.width;
    this.height = img_data.height;

    this.palette = gen_palette(img_data.data.length/4);
    this.kdtree = new KDTree(this.palette);

    this.location_gen = new FrontierLocationGen(this.width, this.height);

    this.clear_image();
}

GrowthImage.prototype.clear_image = function() {
    var width = this.width;
    var height = this.height;
    var color = new Color(0,0,0);
    for(var i=0; i<width; i++){
        for(var j=0; j<height; j++){
            this.set_pixel(i, j, color.r, color.g, color.b, 0);
        }
    }
}

GrowthImage.prototype.iterate = function() {
    var point = this.location_gen.next();

    var target = this.target_color(point.i, point.j);
    var color = this.kdtree.PopClosest(target, 1);
    this.set_pixel(point.i, point.j,
                   color.vals[0], color.vals[1], color.vals[2], 255);
}

GrowthImage.prototype.is_done = function() {
    return (this.kdtree.GetNumLeaves() === 0);
}

GrowthImage.prototype.target_color = function(i,j) {
    var height = this.height;
    var width = this.width;

    var r_total = 0;
    var g_total = 0;
    var b_total = 0;
    var n = 0;

    for(var di=-1; di<=1; di++){
        for(var dj=-1; dj<=1; dj++){
            var index = 4*(this.width*(j+dj) + (i+di));
            if(i+di>=0 && i+di<width &&
               j+dj>=0 && j+dj<height &&
               this.img_data.data[index+3] === 255) {
                r_total += this.img_data.data[index+0];
                g_total += this.img_data.data[index+1];
                b_total += this.img_data.data[index+2];
                n++;
            }
        }
    }

    if(n === 0) {
        return new Color(Math.floor(255*Math.random()),
                         Math.floor(255*Math.random()),
                         Math.floor(255*Math.random()));
    } else {
        r_total = Math.floor(r_total/n);
        g_total = Math.floor(g_total/n);
        b_total = Math.floor(b_total/n);

        return new Color(r_total, g_total, b_total);
    }
}

GrowthImage.prototype.set_pixel = function(i, j, r, g, b, a) {
    var index = 4*(j*this.width + i);
    this.img_data.data[index+0] = r;
    this.img_data.data[index+1] = g;
    this.img_data.data[index+2] = b;
    this.img_data.data[index+3] = a;
}
