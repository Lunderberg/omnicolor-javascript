var Color = function(r, g, b) {
    this.vals = [r,g,b];
}

Color.prototype.dist2 = function(other) {
    return ((this.vals[0]-other.vals[0])*(this.vals[0]-other.vals[0]) +
            (this.vals[1]-other.vals[1])*(this.vals[1]-other.vals[1]) +
            (this.vals[2]-other.vals[2])*(this.vals[2]-other.vals[2]));
}

function gen_palette(n_colors) {
    var dim_size = Math.pow(n_colors, 1.0/3.0);

    var output = [];
    for(var i=0; i<n_colors; i++){
        var val = i + 0.0;
        val /= dim_size;
        var r = Math.floor(255*(val%1));
        val = Math.floor(val);
        val /= dim_size;
        var g = Math.floor(255*(val%1));
        val = Math.floor(val);
        val /= dim_size;
        var b = Math.floor(255*val);

        output.push(new Color(r,g,b));
    }

    return output;
}
