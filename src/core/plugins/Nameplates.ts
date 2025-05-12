import { Plugin } from "../interfaces/plugin.class";
import {Viewport, Matrix, Vector3} from "@babylonjs/core";

export class Nameplates extends Plugin {
    pluginName: string = "Nameplates";
    settings: { [key: string]: string | number | boolean; } = {};

    NampeplateContainer : HTMLDivElement | null = null;
    NPCDomElements = {}
    PlayerDomElements = {}


    init(): void {
        this.log("Initializing");
    }

    start(): void {
        this.log("Started");
    }

    stop(): void {
        this.log("Stopped");
    }

    SocketManager_loggedIn(...args : any) {
        if (!this.DOMElement) {
            this.DOMElement = document.createElement('div');
            this.DOMElement.id = "highlite-nameplates";
            this.DOMElement.style.position = "absolute";
            this.DOMElement.style.pointerEvents = "none";
            this.DOMElement.style.zIndex = "1";
            this.DOMElement.style.overflow = "hidden";
            this.DOMElement.style.width = "100%";
            this.DOMElement.style.height = "100%";
            this.DOMElement.style.fontFamily = "Inter";
            this.DOMElement.style.fontSize = "12px";
            this.DOMElement.style.fontWeight = "bold";
            document.getElementById('game-container')?.appendChild(this.DOMElement);
        }
    }

    SocketManager_handleLoggedOut(...args : any) {
        // Clear the NPC and Player DOM elements
        for (const key in this.NPCDomElements) {
            if (this.NPCDomElements[key]) {
                this.NPCDomElements[key].remove();
            }
        }
        for (const key in this.PlayerDomElements) {
            if (this.PlayerDomElements[key]) {
                this.PlayerDomElements[key].remove();
            }
        }

        this.NPCDomElements = {};
        this.PlayerDomElements = {};
    }

    GameLoop_draw() {
        const NPCS = this.gameHooks.Classes.EntityManager.Instance._npcs; // Map
        const Players = this.gameHooks.Classes.EntityManager.Instance._players; // Array

        // Clear non-existing NPCs
        if (NPCS.size == 0) {
            for (const key in this.NPCDomElements) {
                this.NPCDomElements[key].remove();
                delete this.NPCDomElements[key];
            }
        }
        for (const key in this.NPCDomElements) {
            if (!NPCS[key]) {
                this.NPCDomElements[key].remove();
                delete this.NPCDomElements[key];
            }
        }

        // Clear non-existing Players
        if (Players.length == 0) {
            for (const key in this.PlayerDomElements) {
                this.PlayerDomElements[key].remove();
                delete this.PlayerDomElements[key];
            }
        }

        for (const key in this.PlayerDomElements) {
            for (const player of Players) {
                if (key == player._entityId) {
                    break;
                }

                if (player == Players[Players.length - 1]) {
                    this.PlayerDomElements[key].remove();
                    delete this.PlayerDomElements[key];
                }
            }
        }


        
        // Loop through all NPCs   
        for (const [key,value] of NPCS) {
            const npc = value;
            if (!this.NPCDomElements[key]) {
                this.NPCDomElements[key] = document.createElement('div');
                this.NPCDomElements[key].id = `highlite-nameplates-${key}`;
                this.NPCDomElements[key].style.position = "absolute";
                this.NPCDomElements[key].style.pointerEvents = "none";
                this.NPCDomElements[key].style.zIndex = "1000";
                this.NPCDomElements[key].style.color = "yellow";
                this.NPCDomElements[key].innerHTML = npc._name;
                document.getElementById('highlite-nameplates')?.appendChild(this.NPCDomElements[key]);
            }

            const npcMesh = npc._appearance._billboardMesh;
            // Obtain Position Information
            var boundingBox = npcMesh.getBoundingInfo().boundingBox;
            var height = boundingBox.maximum.y - boundingBox.minimum.y;
            var meshWorldPosition = npcMesh.getAbsolutePosition();
            const scene = npcMesh._scene;
            const camera = scene.activeCamera;

            // Engine Info
            const engine = scene.getEngine();
            const screenWidth = engine.getRenderWidth();
            const screenHeight = engine.getRenderHeight();

            // Project the 3D position to 2D screen coordinates
            const screenPosition = Vector3.Project(
                new Vector3(meshWorldPosition.x, meshWorldPosition.y + height, meshWorldPosition.z), 
                Matrix.Identity(),
                scene.getTransformMatrix(),
                new Viewport(0, 0, screenWidth, screenHeight)
            );
            this.NPCDomElements[key].style.left = `${screenPosition.x - this.NPCDomElements[key].offsetWidth/2}px`;
            this.NPCDomElements[key].style.top = `${screenPosition.y}px`;

            // If not visible, hide the element
            if (screenPosition.z < 0) {
                this.NPCDomElements[key].style.visibility = "hidden";
            }
            else {
                this.NPCDomElements[key].style.visibility = "visible";
            }
        }

        for (const player of Players) {
            if (!this.PlayerDomElements[player._entityId]) {
                this.PlayerDomElements[player._entityId] = document.createElement('div');
                this.PlayerDomElements[player._entityId].id = `highlite-nameplates-${player._entityId}`;
                this.PlayerDomElements[player._entityId].style.position = "absolute";
                this.PlayerDomElements[player._entityId].style.pointerEvents = "none";
                this.PlayerDomElements[player._entityId].style.zIndex = "1000";
                this.PlayerDomElements[player._entityId].style.color = "white";
                this.PlayerDomElements[player._entityId].innerHTML = player._name;
                document.getElementById('highlite-nameplates')?.appendChild(this.PlayerDomElements[player._entityId]);
            }

            // Check if Player is a friend
            const playerFriends = this.gameHooks.Classes.ChatManager.Instance._friends;
            for (const friend of playerFriends) {
                if (friend == player._nameLowerCase) {
                    this.PlayerDomElements[player._entityId].style.color = "lightgreen";
                    break;
                } else {
                    this.PlayerDomElements[player._entityId].style.color = "white";
                }
            }

            const playerMesh = player._appearance._billboardMesh;
            // Obtain Position Information
            var boundingBox = playerMesh.getBoundingInfo().boundingBox;
            var height = boundingBox.maximum.y - boundingBox.minimum.y;
            var meshWorldPosition = playerMesh.getAbsolutePosition();
            const scene = playerMesh._scene;
            const camera = scene.activeCamera;
            // Engine Info
            const engine = scene.getEngine();
            const screenWidth = engine.getRenderWidth();
            const screenHeight = engine.getRenderHeight();
            // Project the 3D position to 2D screen coordinates
            const screenPosition = Vector3.Project(
                new Vector3(meshWorldPosition.x, meshWorldPosition.y + height, meshWorldPosition.z), 
                Matrix.Identity(),
                scene.getTransformMatrix(),
                new Viewport(0, 0, screenWidth, screenHeight)
            );
            this.PlayerDomElements[player._entityId].style.left = `${screenPosition.x - this.PlayerDomElements[player._entityId].offsetWidth/2}px`;
            this.PlayerDomElements[player._entityId].style.top = `${screenPosition.y}px`;
            // If not visible, hide the element
            if (screenPosition.z < 0) {
                this.PlayerDomElements[player._entityId].style.visibility = "hidden";
            }
            else {
                this.PlayerDomElements[player._entityId].style.visibility = "visible";
            }
        }
    }

}


// 