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
      plugin.start();
    }
  }
  async stopAll() {
    for (const plugin of this.plugins) {
      plugin.stop();
    }
  }
  async postInitAll() {
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
    console.log("Highlite Core Initializing!");
    document.highlite = {};
    document.highlite.gameHooks = {};
    document.highlite.gameHooks.Instances = {};
    document.highlite.gameHooks.Listeners = {};
    this.hookListeners("NI");
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
  hookListeners(listenerClass) {
    const self = this;
    const listenerClassObject = document.client.get(listenerClass).prototype;
    (function(originalFunction) {
      listenerClassObject["add"] = function(...args) {
        const returnValue = originalFunction.apply(this, arguments);
        testListen.apply(self, arguments);
        return returnValue;
      };
    })(listenerClassObject["add"]);
  }
  testListen(...args) {
    console.log(...args);
  }
  registerClass(sourceClass, mappedName) {
    const minifiedClass = document.client.get(sourceClass);
    if (!minifiedClass) {
      console.log(`${sourceClass} (${mappedName}) is not defined.`);
      return false;
    }
    document.highlite.gameHooks.Classes[mappedName] = minifiedClass;
    return true;
  }
  registerClassInstance(sourceClass, mappedName) {
    const classInstance = document.client.get(sourceClass);
    if (!classInstance) {
      console.log(`${sourceClass} (${mappedName}) is not defined.`);
      return false;
    }
    document.highlite.gameHooks.Instances[mappedName] = classInstance.Instance;
    return true;
  }
}

// src/core/interfaces/plugin.class.ts
class Plugin {
  instanceHooks = document.highlite.gameHooks.Instances;
  log(...args) {
    console.log(`[${this.pluginName}]`, args);
  }
  info(...args) {
    console.info(`[${this.pluginName}]`, args);
  }
  warn(...args) {
    console.warn(`[${this.pluginName}]`, args);
  }
  error(...args) {
    console.error(`[${this.pluginName}]`, args);
  }
}

// src/core/plugins/RememberMe.ts
class RememberMe extends Plugin {
  pluginName = "RememberMe";
  async init() {
    this.warn("Init Reached");
  }
  async start() {
    this.warn("Start Reached");
  }
  async stop() {
    this.warn("Stop Reached");
    return;
  }
}

// src/index.ts
var highlite = new Highlite;
highlite.pluginLoader.registerPlugin(RememberMe);
highlite.start();
