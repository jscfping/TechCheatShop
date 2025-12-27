

class ServiceCollectionBuilder {
    static get typeSingleton() { return "singleton"; }
    static get typeScope() { return "scope"; }
    static get typeTransient() { return "transient"; }

    constructor() {
        this._collections = {};
    }

    addSingleton(name, factory) {
        if (this._collections[name]) throw new Error(`Service ${name} already registered`);
        this._collections[name] = {
            type: ServiceCollectionBuilder.typeSingleton,
            name,
            factory: factory,
        }
        return this;
    }

    addScope(name, factory) {
        if (this._collections[name]) throw new Error(`Service ${name} already registered`);
        this._collections[name] = {
            type: ServiceCollectionBuilder.typeScope,
            name,
            factory: factory,
        }
        return this;
    }

    addTransient(name, factory) {
        if (this._collections[name]) throw new Error(`Service ${name} already registered`);
        this._collections[name] = {
            type: ServiceCollectionBuilder.typeTransient,
            name,
            factory: factory,
        }
        return this;
    }

    build() {
        return new SingletonContainer(this._collections);
    }
}


class SingletonContainer {
    constructor(collections) {
        this.collections = { ...collections };
        this._instances = {};

        this._pool = new Proxy({}, {
            get: (_, prop) => {
                const service = this.collections[prop];
                if (!service) throw new Error(`Service ${prop} not registered`);
                if (service.type !== ServiceCollectionBuilder.typeSingleton) throw new Error(`Service ${prop} is not singleton`);

                if (!this._instances[prop]) {
                    this._instances[prop] = service.factory(this._pool);
                }
                return this._instances[prop];
            }
        });
    }

    getService(name) {
        return this._pool[name];
    }

    createScope() {
        return new ScopeContainer(this);
    }
}





class ScopeContainer {
    constructor(singletonContainer) {
        this._instances = {};

        this._pool = new Proxy({}, {
            get: (_, prop) => {
                const service = singletonContainer.collections[prop];
                if (!service) throw new Error(`Service ${prop} not registered`);
                if (service.type === ServiceCollectionBuilder.typeSingleton) return singletonContainer.getService(prop);
                if (service.type === ServiceCollectionBuilder.typeTransient) return service.factory(this._pool);

                if (!this._instances[prop]) {
                    this._instances[prop] = service.factory(this._pool);
                }
                return this._instances[prop];
            }
        });
    }

    getService(name) {
        return this._pool[name];
    }
}




class Sg1 {
    constructor() {
        console.log("Sg1 created");

    }
    run() {
        console.log("Sg1 runs");
    }
}

class Sg2 {
    constructor({ ISg1 }) {
        console.log("Sg2 created");
        this._sg1 = ISg1;

    }
    run() {
        console.log("Sg2 runs");
    }
}

class Sp1 {
    constructor({ ISg1, ISg2 }) {
        console.log("Sp1 created");
        this._sg1 = ISg1;
        this._sg2 = ISg2;

    }
    run() {
        console.log("Sp1 runs");
    }
}

class Sp2 {
    constructor({ ISg1, ISg2, ISp1 }) {
        console.log("Sp2 created");
        this._sg1 = ISg1;
        this._sg2 = ISg2;
        this._sp1 = ISp1;

    }
    run() {
        console.log("Sp2 runs");
    }
}

class Ta1 {
    constructor({ ISg1, ISg2, ISp1, ISp2 }) {
        console.log("Ta1 created");
        this._sg1 = ISg1;
        this._sg2 = ISg2;
        this._sp1 = ISp1;
        this._sp2 = ISp2;
    }
    run() {
        console.log("Ta1 runs");
    }
}



const container = new ServiceCollectionBuilder()
    .addSingleton("ISg1", _ => new Sg1())
    .addSingleton("ISg2", p => new Sg2(p))
    .addScope("ISp1", p => new Sp1(p))
    .addScope("ISp2", p => new Sp2(p))
    .addTransient("ITa1", p => new Ta1(p))
    .build();


container.getService("ISg2").run();
container.getService("ISg1").run();

const scope1 = container.createScope();
scope1.getService("ISp1").run();
scope1.getService("ISp2").run();
scope1.getService("ISp1").run();

const scope2 = container.createScope();
scope2.getService("ISp2").run();
scope2.getService("ISp1").run();


scope1.getService("ITa1").run();
scope1.getService("ITa1").run();
scope2.getService("ITa1").run();


