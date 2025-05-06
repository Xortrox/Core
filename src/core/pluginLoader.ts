import { Plugin } from "./interfaces/plugin.class";

export class PluginLoader {
    plugins : Array<Plugin> = []

    constructor() {
        this.plugins = [];
        document.highlite['plugins'] = {};
    }

    async registerPlugin<T extends Plugin>(pluginClass : new () => T) : Promise<boolean> {
        const pluginInstance = new pluginClass();
        await pluginInstance.init();

        document.highlite.plugins[pluginInstance.pluginName] = pluginInstance
        this.plugins.push(pluginInstance);

        return true;
    }

    async startAll() {
        for (const plugin of this.plugins) {
            plugin.start();
        }
    }

    async stopAll() {
        for (const plugin of this.plugins) {
            plugin.stop();
        }
    }

    async postInitAll() {
        for (const plugin of this.plugins) {
            if (plugin.postInit) {
                plugin.postInit();
            }
        }
    }
}