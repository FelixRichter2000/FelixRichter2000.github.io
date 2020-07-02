+function (global) {

    let field_state = function (x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = new Int8Array(x*y*z);
    };
    let proto = field_state.prototype;

    proto.get_state = function (){
        return this.data;
    }

    proto.set = function (x, y, z, value){
        this.check_parameters(x, y, z);

        if(value > 255 || value < 0) throw new Error("Invalid parameter value: " + value);
        
        this.data[x+y*this.x+z*this.x*this.y] = value;
    }

    proto.get = function(x, y, z){
        this.check_parameters(x, y, z);

        return this.data[x+y*this.x+z*this.x*this.y];
    }

    proto.check_parameters = function(x, y, z){
        if(x >= this.x || x < 0) throw new Error("Invalid parameter x: " + x);
        if(y >= this.y || y < 0) throw new Error("Invalid parameter y: " + y);
        if(z >= this.z || z < 0) throw new Error("Invalid parameter z: " + z);
    }

    

    if (typeof process !== 'undefined') {
        module.exports = field_state;
    } else {
        if (!global.match_viewer_ctor) {
            global.match_viewer_ctor = field_state;
        }
    }
}(window);
