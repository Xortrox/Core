import { Highlite } from "./core/core";
import { VersionNotification } from "./core/plugins/VersionNotification";

// This instance self-inserts itself into document.highlite
const highlite = new Highlite();
highlite.pluginLoader.registerPlugin(VersionNotification);
highlite.start();