var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// package.json
var require_package = __commonJS((exports, module) => {
  module.exports = {
    name: "core",
    module: "index.ts",
    version: "0.0.1",
    type: "module",
    private: true,
    devDependencies: {
      "@types/bun": "latest"
    },
    peerDependencies: {
      typescript: "^5"
    }
  };
});

// src/core/pluginLoader.ts
class PluginLoader {
  plugins = [];
  constructor() {
    this.plugins = [];
  }
  registerPlugin(pluginClass) {
    const pluginInstance = new pluginClass;
    pluginInstance.init();
    document.highlite[pluginInstance.pluginName] = pluginInstance;
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

// src/core/core.ts
class Highlite {
  pluginLoader = new PluginLoader;
  constructor() {
    console.info("Highlite Core Initializing!");
    document.highlite = {};
    document.highlite.gameHooks = {};
    document.highlite.gameHooks.Classes = {};
    document.highlite.gameHooks.Listeners = {};
    this.registerClass("mk", "EntityManager");
    this.registerClass("hN", "GroundItemManager");
    this.registerClass("oF", "MeshManager");
    this.registerClass("_F", "WorldMapManager");
    this.registerClass("GR", "AtmosphereManager");
    this.registerClass("sD", "WorldEntityManager");
    this.registerClass("_z", "SpellManager");
    this.registerClass("Ak", "SpellMeshManager");
    this.registerClass("Rk", "GameLoop");
    this.registerClass("zV", "ChatManager");
    this.registerClass("gz", "RangeManager");
    this.registerClass("Dz", "SocketManager");
    this.registerClass("Nz", "ItemManager");
    this.registerClass("kz", "GameEngine");
    this.registerClassHook("GameLoop", "_update");
    this.registerClassHook("SocketManager", "_loggedIn");
    this.registerClassHook("SocketManager", "_handleLoggedOut");
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
  registerClass(sourceClass, mappedName) {
    const classInstance = document.client.get(sourceClass);
    if (!classInstance) {
      console.warn(`${sourceClass} (${mappedName}) is not defined.`);
      return false;
    }
    document.highlite.gameHooks.Classes[mappedName] = classInstance.Instance;
    return true;
  }
  registerClassHook(sourceClass, fnName, hookFn = this.hook) {
    const self = this;
    const classObject = document.highlite.gameHooks.Classes[sourceClass].prototype;
    if (!classObject) {
      console.warn(`Unknown Class ${sourceClass}`);
    }
    let functionName = fnName;
    if (functionName.startsWith("_")) {
      functionName = functionName.substring(1);
    }
    const hookName = `${sourceClass}_${functionName}`;
    console.log(`Hook Added for ${hookName}`);
    (function(originalFunction) {
      classObject[fnName] = function(...args) {
        const returnValue = originalFunction.apply(this, arguments);
        hookFn.apply(self, [hookName, ...args, this]);
        return returnValue;
      };
    })(classObject[fnName]);
    return true;
  }
  hook(fnName, ...args) {
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

// src/core/interfaces/plugin.class.ts
class Plugin {
  gameHooks = document.highlite.gameHooks;
  log(...args) {
    console.info(`[${this.pluginName}]`, ...args);
  }
  info(...args) {
    console.info(`[${this.pluginName}]`, ...args);
  }
  warn(...args) {
    console.warn(`[${this.pluginName}]`, ...args);
  }
  error(...args) {
    console.error(`[${this.pluginName}]`, ...args);
  }
}

// src/core/plugins/HPAlert.ts
var pJSON = require_package();

class HPAlert extends Plugin {
  pluginName = "HPAlert";
  settings = {
    volume: 0.5,
    activationPercent: 0.5,
    enabled: true
  };
  init() {
    this.log("Initializing");
  }
  start() {
    this.log("Started");
  }
  stop() {
    this.log("Stopped");
  }
  GameLoop_update(...args) {
    const player = this.instanceHooks.EntityManager._mainPlayer;
    if (player === undefined) {
      return;
    }
    if (player._hitpoints == undefined) {
      return;
    }
    if (player._hitpoints._currentLevel / player._hitpoints._level < 0.5) {
      const ctx = new AudioContext;
      const gain = ctx.createGain();
      gain.gain.value = 0.1;
      gain.connect(ctx.destination);
      const osc1 = ctx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(440, ctx.currentTime);
      osc1.connect(gain);
      osc1.start(ctx.currentTime);
      osc1.stop(ctx.currentTime + 0.2);
      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(440, ctx.currentTime + 0.25);
      osc2.connect(gain);
      osc2.start(ctx.currentTime + 0.25);
      osc2.stop(ctx.currentTime + 0.45);
    }
  }
}

// src/core/plugins/VersionNotification.ts
var pJSON2 = require_package();

class VersionNotification extends Plugin {
  pluginName = "VersionNotification";
  highliteVersionElement = null;
  settings = {};
  init() {
    this.log("Initializing");
    this.highliteVersionElement = document.createElement("button");
    this.highliteVersionElement.id = "login-screen-clear-game-cache-button";
    this.highliteVersionElement.className = "login-screen-default-text-shadow";
    this.highliteVersionElement.innerText = `Highlite Version ${pJSON2.version}`;
    this.highliteVersionElement.style = "left 0; right: auto; margin:.75rem;";
    document.getElementById("game-container")?.appendChild(this.highliteVersionElement);
  }
  SocketManager_loggedIn(...args) {
    if (!this.highliteVersionElement) {
      return;
    }
    this.highliteVersionElement.style.visibility = "hidden";
  }
  SocketManager_handleLoggedOut(...args) {
    if (!this.highliteVersionElement) {
      return;
    }
    this.highliteVersionElement.style.visibility = "visible";
  }
  start() {
    this.log("Started");
  }
  stop() {
    this.log("Stopped");
  }
}

// src/index.ts
var highlite = new Highlite;
highlite.pluginLoader.registerPlugin(VersionNotification);
highlite.pluginLoader.registerPlugin(HPAlert);
highlite.start();
