import { PluginLoader } from "./pluginLoader";

export class Highlite {
    pluginLoader = new PluginLoader;

    constructor() {
        console.info("Highlite Core Initializing!");

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
        this.registerClassFunctionListener("Dz", "_loggedIn");
        this.registerClassFunctionListener("Dz", "_handleLoggedOut");
        this.registerClassFunctionListener("Kz", "_handleFinishedLoading"); // Login Loading Finished | Currently a Race-Condition


        /*
         Post-Hooking, we tell HighSpell Client to start by re-running DOMContentLoaded
         Highlite Loader removes the client so it does not get a chance to see this event before now.
        */
        document.dispatchEvent(new Event("DOMContentLoaded", {
            bubbles: true,
            cancelable: true
        }));
    }

    start() {
        console.info("Highlite Core Started!");
        this.pluginLoader.postInitAll();
        this.pluginLoader.startAll();
    }

    stop() {
        console.info("Highlite Core Stopped!");
        this.pluginLoader.stopAll();
    }

    reload() {
        console.info("Highlite Core Reloading");
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
            console.warn(`${sourceClass} (${mappedName}) is not defined.`);
            return false;
        }

        document.highlite.gameHooks.Instances[mappedName] = classInstance.Instance;
        return true;
    }

    registerClassFunctionListener(sourceClass : string, fnName : string, hookFn = this.hook) : boolean {
        const self = this;
        const classObject = document.client.get(sourceClass).prototype;
        const hookName = `${sourceClass}_${fnName}`;
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