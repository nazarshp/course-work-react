import cloneDeep from "lodash/cloneDeep";

export class Node {
    
    static get ROOT() { return 'ROOT'; }
    static get LEFT() { return 'LEFT'; }
    static get RIGHT() { return 'RIGHT'; }
    static get INCREMENT() { return 'INCREMENT'; }

    static get RED() { return 'RED'; }
    static get BLACK() { return 'BLACK'; }

    constructor() {
        this.data = null;
        this.leftChild = null;
        this.rightChild = null;
        this.parent = null;
        this.direction = null;
        this.count = 1;
        this.color = Node.RED;
        this.nodePath = "";
    }

    recolor() {
        if (this.color === Node.RED) {
            this.color = Node.BLACK;
        } else {
            this.color = Node.RED;
        }
    }

    get isRoot() {
        return this.parent == null;
    }

    get grandParent() {
        if (this.isRoot) {
            return null;
        } else {
            return this.parent.parent;
        }
    }

    get uncle() {
        var grandParent = this.grandParent;

        if (this.isRoot) {
            return null;

        } else if (grandParent == null) {
            return null;

        } else {
            if (grandParent.leftChild === this.parent) {
                return grandParent.rightChild;
            } else {
                return grandParent.leftChild;
            }
        }
    }

}

export default class Tree {

    constructor() {
        this.root = null;
        this.nodeMap = {};
        this.logger = new TreeLogger();
    }
    
    // Getter functions. 
    
    getNode(nodeId) {
        if (nodeId == null || nodeId === 'null') {
            return null;
        }
        var node = this.nodeMap[nodeId];
        if (typeof node === 'undefined') {
            return null;
        } else {
            return node;
        }
    }

    compile() {
        var map = {};
        this.compileNode(this.root, map, 0); 
        return map;
    }

    compileNode(node, map, level) {

        // Push current node into map.
        var levelKey = level.toString();
        if (map[levelKey] === undefined) {
            map[levelKey] = [];
        } 
        
        if (node != null) {
            map[levelKey].push(node.id);
            // Push children into node.
            this.compileNode(node.leftChild, map, level + 1);
            this.compileNode(node.rightChild, map, level + 1);
        }
    }

    // Validity functions.
    
    fix(jobId) {
        while(this.fixNodes(jobId, this.root)) {
        
        } 
        this.updateNodePaths(this.root, '');
    }

    fixNodes(jobId, node) { 
        var curr = this.fixNode(jobId, node);
        var left = node.leftChild == null ? 
            false : this.fixNodes(jobId, node.leftChild);
        var right = node.rightChild == null ? 
            false : this.fixNodes(jobId, node.rightChild);
        return curr || left || right;
    }

    fixNode(jobId, node) {

        if (node == null || node.color !== Node.RED) {
            return false;
        } 
        
        var parent = node.parent;
        var grandParent = node.grandParent;
        var uncle = node.uncle;
       
        if (node.isRoot && node.color === Node.RED) { 
            // Case 1 - Node is root.
            this.logger.log(jobId, TreeLogger.ERROR, node.id, null, null, 1); 
            node.recolor();
            this.logger.log(jobId, TreeLogger.RECOLOR, node.id, null, null, node.color); 
            return true;
            
        } else if (uncle != null && uncle.color === Node.RED) { 
            // Case 2 - Uncle is red.
            this.logger.log(jobId, TreeLogger.ERROR, node.id, null, null, 2); 

            parent.recolor();
            this.logger.log(jobId, TreeLogger.RECOLOR, parent.id, null, null, parent.color); 

            grandParent.recolor();
            this.logger.log(jobId, TreeLogger.RECOLOR, grandParent.id, null, null, grandParent.color); 
            
            uncle.recolor();
            this.logger.log(jobId, TreeLogger.RECOLOR, uncle.id, null, null, uncle.color); 
            return true;
        
        } else if (uncle == null || uncle.color === Node.BLACK) {  
            if (parent.color === Node.RED && 
                parent.direction !== node.direction) {
                // Case 3 - Uncle is black and triangle exists.
                this.logger.log(jobId, TreeLogger.ERROR, node.id, null, null, 3); 
                if (node.direction === Node.LEFT) { 
                    this.logger.log(jobId, TreeLogger.ROTATE, parent.id, null, Node.RIGHT, null); 
                    this.rotateRight(parent);
                } else { 
                    this.logger.log(jobId, TreeLogger.ROTATE, parent.id, null, Node.LEFT, null); 
                    this.rotateLeft(parent);
                }
                return true; 
                
            } else if (parent.color === Node.RED && 
                parent.direction === node.direction) {
                // Case 4 - Unlce is black and line exists.
                this.logger.log(jobId, TreeLogger.ERROR, node.id, null, null, 4); 
                if (node.direction === Node.LEFT) {
                    this.logger.log(jobId, TreeLogger.ROTATE, grandParent.id, null, Node.RIGHT, null); 
                    this.rotateRight(grandParent);
                } else { 
                    this.logger.log(jobId, TreeLogger.ROTATE, grandParent.id, null, Node.LEFT, null); 
                    this.rotateLeft(grandParent);
                } 
                
                grandParent.recolor(); 
                this.logger.log(jobId, TreeLogger.RECOLOR, grandParent.id, null,  null, grandParent.color); 
                parent.recolor();
                this.logger.log(jobId, TreeLogger.RECOLOR, parent.id, null, null, parent.color); 
                return true;
            }
        }

        return false;
    }

    updateNodePaths(node, nodePath) {
        if (node == null) {return;} 

        var newNodePath = '';

        if (node.isRoot) {
            newNodePath = '';

        } else {
            var pathStep = node.direction == Node.LEFT ? 'L' : 'R';
            newNodePath = nodePath + pathStep;
        }
        node.nodePath = newNodePath;

        this.updateNodePaths(node.leftChild, newNodePath);
        this.updateNodePaths(node.rightChild, newNodePath);
    }

    // Rotation functions.
    
    rotateLeft(node) {

        var rightChild = node.rightChild;
        var parent = node.parent;
        var direction = node.direction;
        var rightChildLeftChild = rightChild.leftChild;

        if (node.isRoot) {
            this.root = rightChild;
        }

        node.parent = rightChild;
        node.direction = Node.LEFT;
        node.rightChild = rightChildLeftChild;
        if (rightChildLeftChild != null) {       
            rightChildLeftChild.parent = node;
        }

        rightChild.parent = parent; 
        rightChild.direction = direction;
        rightChild.leftChild = node;

        if (parent != null) {
            if (direction == Node.LEFT) {
                parent.leftChild = rightChild;
            } else {
                parent.rightChild = rightChild;
            }
        }

        this.updateNodePaths(this.root, '');
    }

    rotateRight(node) {

        var leftChild = node.leftChild;
        var parent = node.parent;
        var direction = node.direction;
        var leftChildRightChild = leftChild.rightChild;

        if (node.isRoot) {
            this.root = leftChild;
        }

        node.parent = leftChild;
        node.direction = Node.RIGHT;
        node.leftChild = leftChildRightChild;
        if (leftChildRightChild != null) {       
            leftChildRightChild.parent = node;
        }

        leftChild.parent = parent; 
        leftChild.direction = direction;
        leftChild.rightChild = node; 

        if (parent != null) {
            if (direction == Node.LEFT) {
                parent.leftChild = leftChild;
            } else {
                parent.rightChild = leftChild;
            }
        }

        this.updateNodePaths(this.root, '');
    }

    // Visualization functions.
    
    print() {
        this.printSubtree(this.root);
    }

    printSubtree(node) {
        if (node == null) {
            return;
        }
        this.printSubtree(node.leftChild);
        this.printSubtree(node.rightChild);
    } 

    // Lookup.
    lookup(jobId, data) {
        this.logger.createEvent(jobId);
        var id = this.bstLookup(jobId, this.root, data);
        if (id == null) { 
            this.logger.log(jobId, TreeLogger.NOT_FOUND, null, null, null, data);
        }
    }

    bstLookup(jobId, node, data) {
        if (node == null) {
            return null;
        }
 
        this.logger.log(jobId, TreeLogger.LOOK, node.id, null, null, null);
        if (node.data === data) {
            this.logger.log(jobId, TreeLogger.FOUND, node.id, null, null, data);
            return node.id; 
        } 

        var left = this.bstLookup(this.leftChild);
        if (left != null) {
            return left;
        }
        var right = this.bstLookup(this.rightChild);
        if (right != null) {
            return right;
        }

        return null;
    }

    // Insertion functions. 
    
    insert(jobId, data) {
        this.logger.createEvent(jobId);
        
        // Insert node and color it red.
        var newId = this.bstInsert(jobId, this.root, data);    

        // Satisfy constraints.
        this.fix(jobId); 
    } 

    bstInsert(jobId, node, data) {

        if (node == null) {
            var newId = this.insertAt(node, Node.ROOT, data);
            this.logger.log(jobId, TreeLogger.INSERT, newId, null, Node.ROOT, data);
            return newId;

        } else {

            this.logger.log(jobId, TreeLogger.LOOK, node.id, null, null, null);

            if (node.data === data) {
                this.logger.log(jobId, TreeLogger.COMPARE, node.id, null, null, null);
                var newId = this.insertAt(node, Node.INCREMENT, data);
                this.logger.log(jobId, TreeLogger.INSERT, newId, node.id, Node.INCREMENT, data);
                node.count += 1;
                return newId;

            } else if (node.data > data) {

                if (node.leftChild == null) { 
                    var newId = this.insertAt(node, Node.LEFT, data);
                    this.logger.log(jobId, TreeLogger.INSERT, newId, node.id, Node.LEFT, data);
                    return newId;

                } else {
                    return this.bstInsert(jobId, node.leftChild, data);
                }

            } else {

                if (node.rightChild == null) {
                    var newId = this.insertAt(node, Node.RIGHT, data); 
                    this.logger.log(jobId, TreeLogger.INSERT, newId, node.id, Node.RIGHT, data);
                    return newId;
                } else {
                    return this.bstInsert(jobId, node.rightChild, data);
                }
            }
        }

    }

    insertAt(parent, direction, data) {

        if (direction === Node.INCREMENT) {
            parent.count += 1;
            return null; 
        }

        var newNode = new Node();
        newNode.data = data;
        newNode.parent = parent;
        var newId = 'id' + data.toString();
        newNode.id = newId;
        newNode.direction = direction;
        this.nodeMap[newId] = newNode;
        
        var parentId = parent == null ? null : parent.id;

        if (direction === Node.ROOT) {
            this.root = newNode; 

        } else if (direction === Node.LEFT) {
            newNode.nodePath = parent.nodePath + 'L';
            parent.leftChild = newNode;

        } else if (direction === Node.RIGHT) {
            newNode.nodePath = parent.nodePath + 'R';
            parent.rightChild = newNode; 

        } 

        return newId;
    }

    // Incremental update functions.
    getSnapshotFromDiff(log) {

        var snapshot = this.snapshot();

        var [eventType, nodeId, parentId, direction, extra] = log.split(':');

        var node = snapshot.getNode(nodeId);
        var parent = snapshot.getNode(parentId);
        
        switch (eventType) {

            case TreeLogger.LOOK:
                break;

            case TreeLogger.INSERT:
                snapshot.insertAt(parent, direction, extra);
                break;

            case TreeLogger.ROTATE:
                if (direction == Node.LEFT) { 
                    snapshot.rotateLeft(node);
                } else {
                    snapshot.rotateRight(node);
                }
                break;

            case TreeLogger.ERROR:
                break;

            case TreeLogger.RECOLOR: 
                node.recolor(); 
                break;
        } 

        return snapshot;

    }

    snapshot() {       
       return cloneDeep(this); 
    }

    getPathMap() {
        var pathMap = {}
        this.getPathMapRecursive(this.root, pathMap);
        return pathMap;
    }

    getPathMapRecursive(node, map) {

        if (node == null) {return map}

        var leftChild = node.leftChild;
        var rightChild = node.rightChild;
        
        if (leftChild != null) {
            var id = node.id + leftChild.id; 
            map[id] = {from: node.id, to:leftChild.id}

            this.getPathMapRecursive(node.leftChild, map);
        }

        if (rightChild != null) {
            var id = node.id + rightChild.id; 
            map[id] = {from: node.id, to:rightChild.id}

            this.getPathMapRecursive(node.rightChild, map);
        }

    }
}

export class TreeLogger {

    static get LOOK() { return 'LOOK'; }
    static get NOT_FOUND() { return 'NOT_FOUND'; }
    static get FOUND() { return 'FOUND'; }
    static get COMPARE() { return 'COMPARE'; }
    static get INSERT() { return 'INSERT'; }
    static get ROTATE() { return 'ROTATE'; }
    static get ERROR() { return 'ERROR'; }
    static get RECOLOR() { return 'RECOLOR'; }

    constructor() {
        this.logs = {};
    }

    createEvent(jobId) {
        this.logs[jobId] = []
    }

    printJob(jobId) {
        console.log(this.logs[jobId]);
    }

    log(jobId, eventType, nodeId, parentId, direction, extra) {

        var eventLogs = this.logs[jobId];
        //var logString = eventLogs.length === 0 ? '' : 'null'; 
        var nodeIdString = nodeId == null ? 'null' : String(nodeId);
        var parentIdString = parentId == null ? 'null' : String(parentId);
        var directionString = direction == null ? 'null' : String(direction);
        var extraString = extra == null ? 'null' : String(extra);

        eventLogs.push(eventType
            + ':' + nodeIdString + ':' + parentIdString 
            + ':' + directionString + ':' + extraString);
    }

    getLogs(jobId) {
        return this.logs[jobId];
    }
}
