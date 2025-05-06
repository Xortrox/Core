import { Highlite } from "./core/core";
import { RememberMe } from "./core/plugins/RememberMe";

// This instance self-inserts itself into document.highlite
new Highlite();
document.highlite.pluginLoader.registerPlugin(RememberMe);
document.highlite.start();