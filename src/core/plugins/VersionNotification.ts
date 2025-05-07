import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";

    async init(): Promise<void> {
        document.addEventListener('DOMContentLoaded', (event) => {
            console.warn("DOM Loaded");
            const highspellLogo = document.getElementById("login-menu-logo") as HTMLDivElement;
            const highliteVersion = document.createElement('div');
            highliteVersion.innerText = `Highlite Version ${pJSON.version}`;
            highliteVersion.id = "login-menu-highlite-version";
            highspellLogo.after(highliteVersion);
        });

        window.addEventListener("load", (event) => {
            console.warn("Window Full Loaded");
        });
    }
    
    async start(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}