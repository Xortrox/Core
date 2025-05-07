import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class HPAlert extends Plugin {
    pluginName: string = "HPAlert";
    settings = {
        volume : 5,
        enabled : true
    };

    async init(): Promise<void> {
        const highliteVersion = document.createElement('button');
        highliteVersion.id = "login-screen-clear-game-cache-button";
        highliteVersion.className = "login-screen-default-text-shadow";
        highliteVersion.innerText = `Highlite Version ${pJSON.version}`;
        highliteVersion.style = "left 0; right: auto; margin:.75rem;";


        document.getElementById('game-container').appendChild(highliteVersion);
    }
    
    async start(): Promise<void> {
        this.log("Started")
    }

    async stop(): Promise<void> {
        this.log("Stopped")
    }

}