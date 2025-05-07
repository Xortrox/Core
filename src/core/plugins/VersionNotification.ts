import { Plugin } from "../interfaces/plugin.class";
let pJSON = require('../../../package.json');


export class VersionNotification extends Plugin {
    pluginName: string = "VersionNotification";
    alertAudio: HTMLAudioElement | null = null;
    settings = {};

    async init(): Promise<void> {
        // Create Audio Source
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        osc.type = 'sine';        // waveform: 'sine', 'square', 'sawtooth', 'triangle'
        osc.frequency.setValueAtTime(440, ctx.currentTime); // A4 = 440Hz
        osc.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1); // play for 1 second
    }
    
    async start(): Promise<void> {
        this.alertAudio?.play();
    }

    async stop(): Promise<void> {
        this.log("Stopped")
    }

}