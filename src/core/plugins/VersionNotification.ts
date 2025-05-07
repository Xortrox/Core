import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";
    alertAudio: HTMLAudioElement | null = null;
    settings = {};

    async init(): Promise<void> {
        // Create Audio Source
        this.alertAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/04/16/audio_f9313e5c93.mp3?filename=alert-109578.mp3");
    }
    
    async start(): Promise<void> {
        this.alertAudio?.play();
    }

    async stop(): Promise<void> {
        this.log("Stopped")
    }

}