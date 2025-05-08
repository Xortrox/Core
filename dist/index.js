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
  async registerPlugin(pluginClass) {
    const pluginInstance = new pluginClass;
    await pluginInstance.init();
    document.highlite[pluginInstance.pluginName] = pluginInstance;
    this.plugins.push(pluginInstance);
    return true;
  }
  async startAll() {
    for (const plugin of this.plugins) {
      await plugin.start();
    }
  }
  async stopAll() {
    for (const plugin of this.plugins) {
      await plugin.stop();
    }
  }
  async postInitAll() {
    for (const plugin of this.plugins) {
      if (plugin.postInit) {
        await plugin.postInit();
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
    document.highlite.gameHooks.Instances = {};
    document.highlite.gameHooks.Listeners = {};
    this.registerClassInstance("mk", "EntityManager");
    this.registerClassInstance("hN", "GroundItemManager");
    this.registerClassInstance("oF", "MeshManager");
    this.registerClassInstance("_F", "WorldMapManager");
    this.registerClassInstance("GR", "AtmosphereManager");
    this.registerClassInstance("sD", "WorldEntityManager");
    this.registerClassInstance("_z", "SpellManager");
    this.registerClassInstance("Ak", "SpellMeshManager");
    this.registerClassInstance("Rk", "GameLoop");
    this.registerClassInstance("zV", "ChatManager");
    this.registerClassInstance("gz", "RangeManager");
    this.registerClassInstance("Dz", "SocketManager");
    this.registerClassInstance("Nz", "ItemManager");
    this.registerClassInstance("kz", "GameEngine");
    this.registerClassFunctionListener("Rk", "_update");
    this.registerClassFunctionListener("Kz", "_handleFinishedLoading");
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
  registerClassInstance(sourceClass, mappedName) {
    const classInstance = document.client.get(sourceClass);
    if (!classInstance) {
      console.warn(`${sourceClass} (${mappedName}) is not defined.`);
      return false;
    }
    document.highlite.gameHooks.Instances[mappedName] = classInstance.Instance;
    return true;
  }
  registerClassFunctionListener(sourceClass, fnName, hookFn = this.hook) {
    const self = this;
    const classObject = document.client.get(sourceClass).prototype;
    const hookName = `${sourceClass}_${fnName}`;
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
  instanceHooks = document.highlite.gameHooks.Instances;
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
  async init() {
    this.log("Initializing");
  }
  async start() {
    this.log("Started");
  }
  async stop() {
    this.log("Stopped");
  }
  async Rk__update(...args) {
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
  settings = {};
  async init() {
    this.log("Initializing");
    const highliteVersion = document.createElement("button");
    highliteVersion.id = "login-screen-clear-game-cache-button";
    highliteVersion.className = "login-screen-default-text-shadow";
    highliteVersion.innerText = `Highlite Version ${pJSON2.version}`;
    highliteVersion.style = "left 0; right: auto; margin:.75rem;";
    document.getElementById("game-container")?.appendChild(highliteVersion);
  }
  async start() {
    this.log("Started");
  }
  async stop() {
    this.log("Stopped");
  }
}

// src/index.ts
var highlite = new Highlite;
highlite.pluginLoader.registerPlugin(VersionNotification);
highlite.pluginLoader.registerPlugin(HPAlert);
highlite.start();
