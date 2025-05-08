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
        this.registerClass("mk", "EntityManager");
        this.registerClass("hN", "GroundItemManager");
        this.registerClass("oF", "MeshManager");
        this.registerClass("_F", "WorldMapManager");
        this.registerClass("GR", "AtmosphereManager");
        this.registerClass("sD", "WorldEntityManager");
        this.registerClass("_z", "SpellManager")
        this.registerClass("Ak", "SpellMeshManager");
        this.registerClass("Rk", "GameLoop");
        this.registerClass("zV", "ChatManager");
        this.registerClass("gz", "RangeManager");
        this.registerClass("Dz", "SocketManager");
        this.registerClass("Nz", "ItemManager");
        this.registerClass("kz", "GameEngine");


        // Function Hook-ins
        this.registerClassHook("GameLoop", "_update");
        this.registerClassHook("SocketManager", "_loggedIn");
        this.registerClassHook("SocketManager", "_handleLoggedOut");


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

    registerClass(sourceClass : string, mappedName : string) : boolean {
        const classInstance = document.client.get(sourceClass);

        if (!classInstance) {
            console.warn(`${sourceClass} (${mappedName}) is not defined.`);
            return false;
        }

        document.highlite.gameHooks.Classes[mappedName] = classInstance.Instance;
        return true;
    }

    registerClassHook(sourceClass : string, fnName : string, hookFn = this.hook) : boolean {
        const self = this;
        const classObject = document.highlite.gameHooks.Classes[sourceClass].prototype;

        if (!classObject) {
            console.warn(`Unknown Class ${sourceClass}`);
        }

        let functionName = fnName;
        if (functionName.startsWith("_")) {
            functionName = functionName.substring(1)
        }

        const hookName = `${sourceClass}_${functionName}`;
        console.log(`Hook Added for ${hookName}`);
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