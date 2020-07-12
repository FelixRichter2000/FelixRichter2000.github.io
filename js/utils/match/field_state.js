class FieldState {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.data = new Int8Array(x * y * z);
    }
    get_state() {
        return this.data;
    }
    set(x, y, z, value) {
        this.check_parameters(x, y, z);

        if (value > 255 || value < 0)
            throw new Error("Invalid parameter value: " + value);

        this.data[x + y * this.x + z * this.x * this.y] = value;
    }
    plus_one(x, y, z) {
        this.check_parameters(x, y, z);

        this.data[x + y * this.x + z * this.x * this.y] += 1;
    }
    get(x, y, z) {
        this.check_parameters(x, y, z);

        return this.data[x + y * this.x + z * this.x * this.y];
    }
    check_parameters(x, y, z) {
        if (x >= this.x || x < 0)
            throw new Error("Invalid parameter x: " + x);
        if (y >= this.y || y < 0)
            throw new Error("Invalid parameter y: " + y);
        if (z >= this.z || z < 0)
            throw new Error("Invalid parameter z: " + z);
    }
}

if (typeof process !== 'undefined') {
    module.exports = FieldState;
}