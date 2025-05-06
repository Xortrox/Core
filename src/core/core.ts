import { PluginLoader } from "./pluginLoader";
import { RememberMe } from "./plugins/RememberMe";

export class Highlite {
    pluginLoader = new PluginLoader;

    constructor() {
        console.log("Highlite Core Initializing!");

        document.highlite = {};
        document.highlite.gameHooks = {}
        document.highlite.gameHooks.Classes = {}
        document.highlite.gameHooks.Instances = {}
        document.highlite.gameHooks.Functions = {}

        // Class Hook-ins (Moslty useful for Function Hook-ins)
        this.registerClass("LF", "MainPlayer");

        // Instance Hook-ins
        this.registerClassInstance("mk", "EntityManager");
        this.registerClassInstance("hN", "GroundItemManager");
        this.registerClassInstance("oF", "MeshManager");
        this.registerClassInstance("_F", "WorldMapManager");
        this.registerClassInstance("GR", "AtmosphereManager");
        this.registerClassInstance("sD", "WorldEntityManager");
        this.registerClassInstance("_z", "SpellManager")
        this.registerClassInstance("Ak", "SpellMeshManager");
        this.registerClassInstance("Rk", "GameLoop");
        this.registerClassInstance("zV", "ChatManager");
        this.registerClassInstance("gz", "RangeManager");
        this.registerClassInstance("Dz", "SocketManager");
        this.registerClassInstance("Nz", "ItemManager");
        this.registerClassInstance("kz", "GameEngine");

        // Function Hook-ins (Relies on Class Hook-ins)
        this.registerFunctionHook("MainPlayer", "OnMoveListener")
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

    hook(functionName : string, ...args : Array<unknown>) {
        for (const plugin of this.pluginLoader.plugins) {
            if (typeof plugin[functionName] === 'function') {
                try {
                    plugin[functionName].apply(plugin, args);
                } catch (e) {
                    console.error(`[GenLite Core] Plugin ${plugin.constructor.pluginName} errored using ${functionName}: ${e}`);
                }
            }
        }
    }

    registerClass(sourceClass : string, mappedName : string) : boolean {
        const minifiedClass = document.client.get(sourceClass);

        if (!minifiedClass) {
            console.log(`${sourceClass} (${mappedName}) is not defined.`);
            return false;
        }

        document.highlite.gameHooks.Classes[mappedName] = minifiedClass;
        return true;
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

    registerFunctionHook(className : string, functionName : string, hookFn = this.hook) {
        const self = this;
        const object = document.highlite.gameHooks.Classes[className].prototype;
        const hookName = `${className}_${functionName}`;

        (function (originalFunction) {
            object[functionName] = function (...args: Array<unknown>) {
                const returnValue = originalFunction.apply(this, arguments);

                hookFn.apply(self, [hookName, ...args, this]);

                return returnValue;
            };
        }(object[functionName]));
    }
}