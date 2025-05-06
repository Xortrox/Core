import { Highlite } from "./core/core";
import { RememberMe } from "./core/plugins/RememberMe";

document.highlite = new Highlite();
document.highlite.pluginLoader.registerPlugin(RememberMe);
document.highlite.start();