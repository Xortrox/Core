import { Highlite } from "./core/core";
import { RememberMe } from "./core/plugins/RememberMe";

// This instance self-inserts itself into document.highlite
const highlite = new Highlite();
highlite.pluginLoader.registerPlugin(RememberMe);
highlite.start();