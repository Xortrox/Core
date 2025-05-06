import { Plugin } from "../interfaces/plugin.class";

export class RememberMe extends Plugin {
    pluginName = "RememberMe";

    async init(): Promise<void> {
        this.warn("Init Reached");
    }

    async start(): Promise<void> {
        this.warn("Start Reached");
    }

    async stop(): Promise<void> {
        this.warn("Stop Reached");
        return;
    }
    
}