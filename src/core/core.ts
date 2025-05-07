import { listen } from "bun";
import { PluginLoader } from "./pluginLoader";
import { RememberMe } from "./plugins/RememberMe";

export class Highlite {
    pluginLoader = new PluginLoader;

    constructor() {
        console.log("Highlite Core Initializing!");

        document.highlite = {};
        document.highlite.gameHooks = {};
        document.highlite.gameHooks.Instances = {};
        document.highlite.gameHooks.Listeners = {};

        // Listeners Hook-In
        // this.attachListeners("NI");

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


        // Function Hook-ins
        this.registerClassFunctionListener("Rk", "_update");
        this.registerInstanceFunctionListener("Kz", "_handleFinishedLoading"); // Login Loading Finished
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

    // attachListeners(listenerClass: string) {
    //     const self = this;
    //     const listenerClassObject = document.client.get(listenerClass).prototype;

    //     (function (originalFunction : any) {
    //         listenerClassObject["add"] = function (...args : Array<unknown>) {
    //             const returnValue = originalFunction.apply(this, arguments);
    //             console.warn(`Added ${args[0].name}`);
    //             return returnValue;
    //         }
    //     }(listenerClassObject["add"]));


    //     (function (originalFunction : any) {
    //         listenerClassObject["invoke"] = function (...args : Array<unknown>) {
    //             const returnValue = originalFunction.apply(this, arguments);
    //             console.warn(`Invoke ${args}`);
    //             return returnValue;
    //         }
    //     }(listenerClassObject["invoke"]));
    // }

    // registerClass(sourceClass : string, mappedName : string) : boolean {
    //     const minifiedClass = document.client.get(sourceClass);

    //     if (!minifiedClass) {
    //         console.log(`${sourceClass} (${mappedName}) is not defined.`);
    //         return false;
    //     }

    //     document.highlite.gameHooks.Classes[mappedName] = minifiedClass;
    //     return true;
    // }

    registerClassInstance(sourceClass : string, mappedName : string) : boolean {
        const classInstance = document.client.get(sourceClass);

        if (!classInstance) {
            console.log(`${sourceClass} (${mappedName}) is not defined.`);
            return false;
        }

        document.highlite.gameHooks.Instances[mappedName] = classInstance.Instance;
        return true;
    }

    registerClassFunctionListener(sourceClass : string, fnName : string, hookFn = this.hook) : boolean {
        const self = this;
        const classObject = document.client.get(sourceClass).prototype;
        const hookName = `${sourceClass}_${fnName}`;
        console.log("Hooking");
        (function (originalFunction : any) {
            classObject[fnName] = function (...args : Array<unknown>) {
                const returnValue = originalFunction.apply(this, arguments);
                hookFn.apply(self, [hookName, ...args, this]);
                return returnValue;
            }
        }(classObject[fnName]));

        return true;
    }

    registerInstanceFunctionListener(sourceClass : string, fnName : string, hookFn = this.hook) : boolean {
        const self = this;
        const classObject = document.client.get(sourceClass);
        const hookName = `${sourceClass}_${fnName}`;
        console.log("Hooking");
        (function (originalFunction : any) {
            classObject[fnName] = function (...args : Array<unknown>) {
                const returnValue = originalFunction.apply(this, arguments);
                hookFn.apply(self, [hookName, ...args, this]);
                return returnValue;
            }
        }(classObject[fnName]));

        return true;        
    }


    hook(fnName : string, ...args : Array<unknown>) {
        console.warn("fnName: " + fnName);
        for (const plugin of this.pluginLoader.plugins) {
            if (typeof plugin[fnName] === "function") {
                try {
                    plugin[fnName].apply(plugin, args);
                } catch (e) {
                    console.error("Hooking Failed");
                }
            }
        }
    }
}