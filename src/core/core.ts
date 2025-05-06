import { PluginLoader } from "./pluginLoader";
import { RememberMe } from "./plugins/RememberMe";

export class Highlite {
    pluginLoader = new PluginLoader;

    constructor() {
        console.log("Highlite Core Initializing!");
        // Data Hook-ins

        // Function Hook-ins
    }

    start() {
        console.log("Highlite Core Started!");
        this.pluginLoader.postInitAll();
        this.pluginLoader.startAll();
    }

    stop() {
        console.log("Highlite Core Stopped!");
        this.pluginLoader.stopAll();
    }

    reload() {
        console.log("Highlite Core Reloading");
        this.stop();
        this.start();
    }

    registerDataInstance() {

    }

    registerFunctionHook() {

    }
}