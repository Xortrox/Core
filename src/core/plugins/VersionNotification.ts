import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";
    settings = {};

    async init(): Promise<void> {
        this.log('Initializing');
        const highliteVersion = document.createElement('button');
        highliteVersion.id = "login-screen-clear-game-cache-button";
        highliteVersion.className = "login-screen-default-text-shadow";
        highliteVersion.innerText = `Highlite Version ${pJSON.version}`;
        highliteVersion.style = "left 0; right: auto; margin:.75rem;";
        document.getElementById('game-container')?.appendChild(highliteVersion);
    }

    async Dk__loggedIn(...args : any) {
        this.log("Logged In");
    }

    async Dk__handleLoggedOut(...args : any) {
        this.log("Logged Out");
    }
    
    async start(): Promise<void> {
        this.log("Started");
    }

    async stop(): Promise<void> {
        this.log("Stopped");
    }

}