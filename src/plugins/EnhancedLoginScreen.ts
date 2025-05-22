import { Plugin } from "../core/interfaces/highlite/plugin/plugin.class";

export class EnhancedLoginScreen extends Plugin {
    pluginName: string = "Enhanced Login Screen";

    videoElement : HTMLVideoElement | null = null;

    init(): void {
        this.log("Initializing");
        this.videoElement = document.getElementsByClassName("video-background")[0] as HTMLVideoElement;
    }

    start(): void {
        this.videoElement!.style.visibility = this.settings.enable.value ? "visible" : "hidden";
    }

    stop(): void {
        this.videoElement!.style.visibility = this.settings.enable.value ? "visible" : "hidden";
    }

    SocketManager_loggedIn(...args: any) {
        this.log("Logged in");
        this.videoElement!.style.visibility = "hidden";
    }

    SocketManager_handleLoggedOut(...args: any) {
        this.log("Logged out");
        this.videoElement!.style.visibility = "visible";
    }
}