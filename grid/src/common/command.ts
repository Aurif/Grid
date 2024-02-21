export function command(target: any, key: string) {
    let func = target[key];
    const getter = function () {
        // @ts-ignore
        return func.bind(this);
    };
  
    return Object.defineProperty(target, key, {
        get: getter,
        configurable: true,
        enumerable: true,
    });
}

export class Command {
    static combine<T extends (...args: any[])=>void>(...commands: T[]): T {
        return ((...args: any[]) => {
            for (let c of commands) c(...args);
        }) as T
    }
}