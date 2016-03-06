// Result returned by internal searches in the kdtree
var SearchResult = function(dist2, leaf, index) {
    this.dist2 = dist2;
    this.leaf = leaf;
    this.index = index;
}


// Base class for InternalNode and LeafNode.
// Supports pop/peek queries for the closest neighbor to a query
var NodeBase = function() {
    this.parent = null;
}

NodeBase.prototype.PopClosest = function(query, epsilon) {
    var result = this.GetClosestNode(query, epsilon);
    var node = result.leaf.parent;
    while(node !== null) {
        node.leaves_unused--;
        node = node.parent;
    }

    return result.leaf.PopValue(result.index);
}

NodeBase.prototype.GetClosest = function(query, epsilon) {
    var result = this.GetClosestNode(query, epsilon);
    return result.leaf.GetValue(result.index);
}


// InternalNode, which contains two subnodes.
var InternalNode = function(left, right, dimension, median) {
    NodeBase.call(this);
    this.left = left;
    this.left.parent = this;
    this.right = right;
    this.right.parent = this;

    this.dimension = dimension;
    this.median = median;
    this.leaves_unused = this.left.leaves_unused + this.right.leaves_unused;
}
InternalNode.prototype = new NodeBase();
InternalNode.prototype.constructor = InternalNode;

InternalNode.prototype.GetClosestNode = function(query, epsilon) {
    // If one of the branches is empty, use the other one.
    if(this.left.leaves_unused === 0) {
        return this.right.GetClosestNode(query, epsilon);
    } else if (this.right.leaves_unused === 0) {
        return this.left.GetClosestNode(query, epsilon);
    }

    // Check on the side recommended by the median heuristic.
    var diff = query.vals[this.dimension] - this.median;
    if(diff<0) {
        var res1 = this.left.GetClosestNode(query, epsilon);
    } else {
        var res1 = this.right.GetClosestNode(query, epsilon);
    }
    var allowed_diff = diff*(1+epsilon);
    if(allowed_diff*allowed_diff > res1.dist2) {
        return res1
    }

    // Couldn't bail out early, so check on the other sie.
    if(diff<0) {
        var res2 = this.right.GetClosestNode(query, epsilon);
    } else {
        var res2 = this.left.GetClosestNode(query, epsilon);
    }
    return (res1.dist2 < res2.dist2) ? res1 : res2;
}


// A leaf node, which contains one or more final values.
var LeafNode = function(values) {
    NodeBase.call(this);
    this.values = values;
    this.leaves_unused = values.length;

    this.used = new Array(values.length)
    this.used.fill(false);
}
LeafNode.prototype = new NodeBase();
LeafNode.prototype.constructor = LeafNode;

LeafNode.prototype.GetValue = function(index) {
    return this.values[index];
}

LeafNode.prototype.PopValue = function(index) {
    this.used[index] = true;
    this.leaves_unused--;
    return this.values[index];
}

LeafNode.prototype.GetClosestNode = function(query, epsilon) {
    var best_distance2 = 1e15;
    var best_index = 0;

    var length = this.values.length;
    for(var i=0; i<length; i++){
        if(!this.used[i]){
            var dist2 = query.dist2(this.values[i]);
            if(dist2 < best_distance2){
                best_distance2 = dist2;
                best_index = i;
            }
        }
    }
    return new SearchResult(best_distance2, this, best_index);
}

var KDTree = function(palette) {
    this.root = this.make_node(palette, 0);
}

KDTree.prototype.make_node = function(palette, start_dim) {
    if(palette.length < 50) {
        return new LeafNode(palette);
    } else {
        for(var dim_mod=0; dim_mod<3; dim_mod++){
            var dim = (start_dim + dim_mod) % 3;
            palette.sort(function(a,b) { return a.vals[dim] - b.vals[dim]; });

            var median_index = Math.floor(palette.length/2);
            var median_value = palette[median_index].vals[dim];
            while(median_index < palette.length &&
                  palette[median_index].vals[dim]===median_value) {
                median_index++;
            }
            if(median_index === palette.length){
                median_index = Math.floor(palette.length/2);
                while(median_index >= 0 &&
                      palette[median_index].vals[dim]===median_value) {
                    median_index--;
                }
            }

            if(median_index >= 0) {
                var next_dim = (dim+1) % 3;
                var left = palette.slice(0, median_index);
                var right = palette.slice(median_index);
                return new InternalNode(this.make_node(left, next_dim),
                                        this.make_node(right, next_dim),
                                        dim, median_value);
            }
        }

        return new LeafNode(palette);
    }
}

KDTree.prototype.PopClosest = function(query, epsilon) {
    return this.root.PopClosest(query, epsilon);
}

KDTree.prototype.GetClosest = function(query, epsilon) {
    return this.root.GetClosest(query, epsilon);
}

KDTree.prototype.GetNumLeaves = function() {
    return this.root.leaves_unused;
}
