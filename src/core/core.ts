import { ContextMenuHelper } from "./helpers/ContextMenuHelpers";
import { NotificationHelper } from "./helpers/NotificationHelper";
import { PluginLoader } from "./pluginLoader";

export class Highlite {
    pluginLoader = new PluginLoader;
    contextMenuHelper = new ContextMenuHelper;

    constructor() {
        console.info("[Highlite] Core Initializing!");

        document.highlite = {};
        document.highlite.Helpers = {};
        document.highlite.Helpers.ContextMenu = this.contextMenuHelper;
        document.highlite.gameHooks = {};
        document.highlite.gameHooks.Classes = {};
        document.highlite.gameHooks.Listeners = {};
        document.BABYLON = document.client.get("ro")

        // Listeners Hook-In
        // this.attachListeners("NI");

        // Instance Hook-ins
        this.registerClass("Ck", "EntityManager");
        this.registerClass("hN", "GroundItemManager");
        this.registerClass("oF", "MeshManager");
        this.registerClass("_F", "WorldMapManager");
        this.registerClass("GR", "AtmosphereManager");
        this.registerClass("sD", "WorldEntityManager");
        this.registerClass("Iz", "SpellManager")
        this.registerClass("Dk", "SpellMeshManager");
        this.registerClass("wk", "GameLoop");
        this.registerClass("$V", "ChatManager");
        this.registerClass("Pz", "RangeManager");
        this.registerClass("zz", "SocketManager");
        this.registerClass("qz", "ItemManager");
        this.registerClass("$z", "GameEngine");
        this.registerClass("LF", "MainPlayer");
        this.registerClass("tR", "GameCameraManager");
        this.registerClass("RX", "HealthBar")

        // Needs Naming
        this.registerClass("AF", "AF");
        this.registerClass("aG", "aG")


        // Function Hook-ins
        this.registerClassHook("GameLoop", "_update");
        this.registerClassHook("GameLoop", "_draw");
        this.registerClassHook("SocketManager", "_loggedIn");
        this.registerClassHook("SocketManager", "_handleLoggedOut");
        this.registerClassHook("SocketManager", "_handleEnteredIdleStateAction");
        this.registerClassHook("EntityManager", "addOtherPlayer");
        this.registerClassHook("HealthBar", "_updateCurrentHealthbarColor");

        // Needs Naming
        this.registerClassHook("AF", "addItemToInventory");
        this.contextMenuHelper.registerContextHook("vG", "_createInventoryItemContextMenuItems", this.contextMenuHelper.inventoryContextHook);
        this.contextMenuHelper.registerContextHook("vG", "_createGameWorldContextMenuItems", this.contextMenuHelper.gameWorldContextHook);
        this.registerStaticClassHook('dG', 'handleTargetAction');
        this.registerClassHook("ItemManager", "invokeInventoryAction");

        
        NotificationHelper.askNotificationPermission();
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
        console.info("[Highlite] Core Started!");
        this.pluginLoader.initAll();
        this.pluginLoader.postInitAll();
        this.pluginLoader.startAll();
    }

    stop() {
        console.info("[Highlite] Core Stopped!");
        this.pluginLoader.stopAll();
    }

    reload() {
        console.info("[Highlite] Core Reloading");
        this.stop();
        this.start();
    }

    registerClass(sourceClass : string, mappedName : string) : boolean {
        const classInstance = document.client.get(sourceClass);

        if (!classInstance) {
            console.warn(`[Highlite] ${sourceClass} (${mappedName}) is not defined in client.`);
            return false;
        }

        document.highlite.gameHooks.Classes[mappedName] = classInstance;
        return true;
    }

    registerClassHook(sourceClass : string, fnName : string, hookFn = this.hook) : boolean {
        const self = this;
        const classObject = document.highlite.gameHooks.Classes[sourceClass].prototype;

        if (!classObject) {
            console.warn(`[Highlite] Attempted to register unknown client class hook (${sourceClass}).`);
        }

        let functionName = fnName;
        if (functionName.startsWith("_")) {
            functionName = functionName.substring(1)
        }

        const hookName = `${sourceClass}_${functionName}`;
        (function (originalFunction : any) {
            classObject[fnName] = function (...args : Array<unknown>) {
                const originalReturn = originalFunction.apply(this, arguments);
                hookFn.apply(self, [hookName, ...args, this]);
                
                return originalReturn;
            }
        }(classObject[fnName]));

        return true;
    }

    registerStaticClassHook(sourceClass : string, fnName : string, hookFn = this.hook) : boolean {
        const self = this;
        const classObject = document.client.get(sourceClass);

        if (!classObject) {
            console.warn(`[Highlite] Attempted to register unknown static client class hook (${sourceClass}).`);
        }

        let functionName = fnName;
        if (functionName.startsWith("_")) {
            functionName = functionName.substring(1)
        }

        const hookName = `${sourceClass}_${functionName}`;
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
                    console.error(`[${plugin.pluginName}] Error with Hook ${fnName}: ${e}`);
                }
            }
        }
    }
}