export abstract class Plugin {
    abstract pluginName : string;

    abstract init(): Promise<void>;
    abstract start(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract settings : {
        [key: string] : number | boolean | string;
    }
    
    postInit?(): Promise<void>;

    instanceHooks = document.highlite.gameHooks.Instances;

    // Log seems to be broken from loading HighSpell Client
    async log(...args: any[]) : Promise<void> {
        await console.info(`[${this.pluginName}]`, ...args);
    }

    async info(...args: any[]) : Promise<void> {
        await console.info(`[${this.pluginName}]`, ...args);
    }

    async warn(...args: any[]) : Promise<void> {
        await console.warn(`[${this.pluginName}]`, ...args);
    }

    async error(...args: any[]) : Promise<void> {
        await console.error(`[${this.pluginName}]`, ...args);
    }
}
