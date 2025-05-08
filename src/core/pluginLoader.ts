import { Plugin } from "./interfaces/plugin.class";

export class PluginLoader {
    plugins : Array<Plugin> = []

    constructor() {
        this.plugins = [];
    }

    registerPlugin<T extends Plugin>(pluginClass : new () => T) : boolean {
        const pluginInstance = new pluginClass();
        pluginInstance.init();

        document.highlite[pluginInstance.pluginName] = pluginInstance
        this.plugins.push(pluginInstance);

        return true;
    }

    startAll() {
        for (const plugin of this.plugins) {
            plugin.start();
        }
    }

    stopAll() {
        for (const plugin of this.plugins) {
            plugin.stop();
        }
    }

    postInitAll() {
        for (const plugin of this.plugins) {
            if (plugin.postInit) {
                plugin.postInit();
            }
        }
    }
}