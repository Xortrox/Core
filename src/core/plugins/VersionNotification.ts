import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";

    async init(): Promise<void> {
        const highliteVersion = document.createElement('button');
        highliteVersion.id = "login-screen-clear-game-cache-button highliteVersion";
        highliteVersion.className = "login-screen-default-text-shadow";
        highliteVersion.innerText = `Highlite Version ${pJSON.version}`;
        highliteVersion.style = "left 0; right: auto;";


        document.appendChild(highliteVersion);
    }
    
    async start(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async stop(): Promise<void> {
        throw new Error("Method not implemented.");
    }

}