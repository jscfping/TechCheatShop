

function toJSON(object) {
    const obj = {};

    for (const key of Object.keys(object)) {
        obj[key] = object[key];
    }

    const proto = Object.getPrototypeOf(object);
    for (const key of Object.getOwnPropertyNames(proto)) {
        const desc = Object.getOwnPropertyDescriptor(proto, key);
        if (desc && typeof desc.get === "function") {
            obj[key] = object[key];
        }
    }
    return JSON.stringify(obj);
}

class A {
    constructor() {
      this.prop1 = 'value1';
      this.prop2 = 'value2';
    }
  
    get prop3() {
      return "value3";
    }
  
    method1() {
      return this.prop1;
    }
  }
  
  const a = new A();
  console.log(toJSON(a));


  