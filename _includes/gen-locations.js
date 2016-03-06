var Point = function(i,j) {
    this.i = i;
    this.j = j;
}

var SequentialLocationGen = function(width, height) {
    this.width = width;
    this.height = height;
    this.i = -1;
    this.j = 0;
}

SequentialLocationGen.prototype.next = function() {
    this.i++;
    if(this.i >= this.width){
        this.j++;
        this.i = 0;
    }

    return new Point(this.i, this.j);
}

var FrontierLocationGen = function(width, height) {
    this.width = width;
    this.height = height;
    this.used = new Array(width*height);
    this.used.fill(false);
    this.frontier = [];
}

FrontierLocationGen.prototype.next = function() {
    // Pick a point to use.
    if(this.frontier.length > 0) {
        var point = this.frontier.splice(
            Math.floor(Math.random()*this.frontier.length), 1)[0];
    } else {
        var point = Math.floor(this.width*this.height * Math.random());
        this.used[point] = true;
    }
    var i = point % this.width;
    var j = Math.floor(point/this.width);

    // Add any unused adjacent points to the frontier.
    for(var di=-1; di<=1; di++){
        for(var dj=-1; dj<=1; dj++){
            if(i+di>=0 && i+di<this.width &&
               j+dj>=0 && j+dj<this.height) {
                var index = this.width*(j+dj) + (i+di);
                if(!this.used[index]){
                    this.used[index] = true;
                    this.frontier.push(index);
                }
            }
        }
    }

    return new Point(i,j);
}
