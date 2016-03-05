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

    var output = result.leaf.PopValue(result.index);
    //alert("Result color: (" + output.r + "," + output.g + "," + output.b + ")");

    return output;
}

NodeBase.prototype.GetClosest = function(query, epsilon) {
    var result = this.GetClosestNode(query, epsilon);
    return result.leaf.GetValue(result.index);
}


// InternalNode, which contains two subnodes.
var InternalNode = function() {
    NodeBase.call(this);
}
InternalNode.prototype = new NodeBase();
InternalNode.prototype.constructor = InternalNode;


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
    return new LeafNode(palette);
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
