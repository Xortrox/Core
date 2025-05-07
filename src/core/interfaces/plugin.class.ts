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

    log(...args: any[]) : void {
        console.log(`[${this.pluginName}]`, args);
    }

    info(...args: any[]) : void {
        console.info(`[${this.pluginName}]`, args);
    }

    warn(...args: any[]) : void {
        console.warn(`[${this.pluginName}]`, args);
    }

    error(...args: any[]) : void {
        console.error(`[${this.pluginName}]`, args);
    }
}
