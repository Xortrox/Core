import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";

    async init(): Promise<void> {
    }

    async Kz__handleFinishedLoading(...args) {
        console.error("Made it");
        const highspellLogo = document.getElementById("login-menu-logo") as HTMLDivElement;
        const highliteVersion = document.createElement('div');
        highliteVersion.innerText = `Highlite Version ${pJSON.version}`;
        highliteVersion.id = "login-menu-highlite-version";
        highspellLogo.after(highliteVersion);
    }
    
    async start(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}