import { Plugin } from "../interfaces/plugin.class";

export class EnhancedHPBars extends Plugin {
    pluginName: string = "EnhancedHPBars";
    settings: { [key: string]: string | number | boolean; } = {};

    init(): void {
        this.log("Initializing");
    }

    start(): void {
        this.log("Started");
    }

    stop(): void {
        this.log("Stopped");
    }

    HealthBar_updateCurrentHealthbarColor(healthManager : any) {
        const healthLevel = healthManager._hitpointsLevel;
        const currentHealth = healthManager._currentHitpointsLevel;

        if (healthManager._currentHealthbar.children.length == 0) {
            // Add a span showing healthLevel / currentHealth
            const healthText = document.createElement("span");
            healthText.innerText = `${currentHealth} / ${healthLevel}`;
            healthText.style.fontSize = "10px";
            healthText.style.fontWeight = "bold";
            healthText.style.position = "absolute";
            healthText.style.whiteSpace = "nowrap";
            healthText.style.fontFamily = "Inter";
            healthText.style.left = "-1px";
            healthManager._currentHealthbar.appendChild(healthText);
        } else {
            // Update the span showing healthLevel / currentHealth
            const healthText = healthManager._currentHealthbar.children[0];
            healthText.innerText = `${currentHealth} / ${healthLevel}`;
        }
    }
}