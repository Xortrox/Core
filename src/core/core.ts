import { PluginLoader } from "./pluginLoader";
import { RememberMe } from "./plugins/RememberMe";

export class Highlite {
    pluginLoader = new PluginLoader;

    constructor() {
        console.log("Highlite Core Initializing!");

        document.highlite = {};
        document.highlite.gameHooks = {}
        document.highlite.gameHooks.Instances = {}
        document.highlite.gameHooks.Functions = {}

        // Data Hook-ins
        this.registerClassInstance("mk", "EntityManager");

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

    registerClassInstance(sourceClass : string, mappedName : string) : boolean {
        const classInstance = document.client.get(sourceClass);

        if (!classInstance) {
            console.log(`${sourceClass} (${mappedName}) is not defined.`);
            return false;
        }

        document.highlite.gameHooks.Instances[mappedName] = classInstance.Instance;
        return true;
    }

    registerFunctionHook() {

    }
}