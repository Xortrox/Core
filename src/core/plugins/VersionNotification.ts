import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";
    settings = {};

    init(): void {
        this.log('Initializing');
        const highliteVersion = document.createElement('button');
        highliteVersion.id = "login-screen-clear-game-cache-button";
        highliteVersion.className = "login-screen-default-text-shadow";
        highliteVersion.innerText = `Highlite Version ${pJSON.version}`;
        highliteVersion.style = "left 0; right: auto; margin:.75rem;";
        document.getElementById('game-container')?.appendChild(highliteVersion);
    }

    Dz__loggedIn(...args : any) {
        this.log("Logged In");
    }

    Dz__handleLoggedOut(...args : any) {
        this.log("Logged Out");
    }
    
    start(): void {
        this.log("Started");
    }

    stop(): void {
        this.log("Stopped");
    }

}