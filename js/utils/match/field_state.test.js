const field_state_ctor = require('./field_state');

describe('Test field_state no params', function () {
    test('new field_state() no error', () => {
        const field_state = new field_state_ctor(2,2,2);
    });
});

describe('Test get_state', function () {
    test('2*2*2', () => {
        const field_state = new field_state_ctor(2,2,2);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([0,0,0,0,0,0,0,0]));
    });
    test('2*3*1', () => {
        const field_state = new field_state_ctor(2,3,1);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([0,0,0,0,0,0]));
    });    
    test('2*3*1', () => {
        const field_state = new field_state_ctor(2,1,1);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([0,0]));
    });
});

describe('Test set parameter check', function () {
    test('x=2: x invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(2, 0, 0)).toThrow();
    });  
    test('x=1: x valid should not throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(1, 0, 0)).not.toThrow();
    });  
    test('x=0: x valid should not throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0)).not.toThrow();
    });  
    test('x=-1: x invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(-1, 0, 0)).toThrow();
    });  

    test('y=2: y invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 2, 0)).toThrow();
    });  
    test('y=0: y valid should not throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0)).not.toThrow();
    });  
    test('y=-1: y invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, -1, 0)).toThrow();
    });
    
    test('z=2: z invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 2)).toThrow();
    });  
    test('z=0: z valid should not throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0)).not.toThrow();
    });  
    test('z=-1: z invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, -1)).toThrow();
    });

       
    test('value=256: value invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0, 256)).toThrow();
    });  
    test('value=255: value valid should not throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0, 255)).not.toThrow();
    });  
    test('value=0: value valid should not throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0, 0)).not.toThrow();
    });  
    test('value=-1: value invalid should throw', () => {
        const field_state = new field_state_ctor(2,2,2);
        expect(() => field_state.set(0, 0, 0, -1)).toThrow();
    });
});

describe('Test set state', function () {
    test('set 5 at 0,0,0', () => {
        const field_state = new field_state_ctor(2,2,2);
        field_state.set(0, 0, 0, 5);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([5,0,0,0,0,0,0,0]));
    });
    test('set 5 at 0,1,0', () => {
        const field_state = new field_state_ctor(2,2,2);
        field_state.set(0, 1, 0, 5);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([0,0,5,0,0,0,0,0]));
    });    
    test('set 5 at 0,1,1', () => {
        const field_state = new field_state_ctor(2,2,2);
        field_state.set(0, 1, 1, 5);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([0,0,0,0,0,0,5,0]));
    }); 
    test('set 5 at 1,1,1', () => {
        const field_state = new field_state_ctor(2,2,2);
        field_state.set(1, 1, 1, 5);
        let state = field_state.get_state();
        expect(state).toEqual(new Int8Array([0,0,0,0,0,0,0,5]));
    }); 
});

