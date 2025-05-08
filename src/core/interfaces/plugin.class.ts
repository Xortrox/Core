export abstract class Plugin {
    abstract pluginName : string;

    abstract init(): void;
    abstract start(): void;
    abstract stop(): void;
    abstract settings : {
        [key: string] : number | boolean | string;
    }
    
    postInit?(): void;

    gameHooks = document.highlite.gameHooks

    // Log seems to be broken from loading HighSpell Client
    log(...args: any[]) : void {
        console.info(`[${this.pluginName}]`, ...args);
    }

    info(...args: any[]) : void {
        console.info(`[${this.pluginName}]`, ...args);
    }

    warn(...args: any[]) : void {
        console.warn(`[${this.pluginName}]`, ...args);
    }

    error(...args: any[]) : void {
        console.error(`[${this.pluginName}]`, ...args);
    }
}
