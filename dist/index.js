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
    document.highlite.gameHooks = {};
    document.highlite.gameHooks.Instances = {};
    document.highlite.gameHooks.Functions = {};
    this.registerClassInstance("mk", "EntityManager");
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
  registerClassInstance(sourceClass, mappedName) {
    const classInstance = document.client.get(sourceClass);
    if (!classInstance) {
      console.log(`${sourceClass} (${mappedName}) is not defined.`);
      return false;
    }
    document.highlite.gameHooks.Instances[mappedName] = classInstance.Instance;
    return true;
  }
  registerFunctionHook() {}
}

// src/core/interfaces/plugin.class.ts
class Plugin {
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
document.highlite = new Highlite;
document.highlite.pluginLoader.registerPlugin(RememberMe);
document.highlite.start();
