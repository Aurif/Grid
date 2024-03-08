export default function singleton<C>(constructor: { new(): C }): ()=>C {
    let instance: C
    return function inner(this: any): C {
        if(!instance) instance = new constructor();
        return instance
    }
}