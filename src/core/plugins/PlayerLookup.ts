import { Plugin } from "../interfaces/plugin.class";
import { AddEntityAction } from "../helpers/ContextMenuHelpers";

export class PlayerLookup extends Plugin {
    pluginName: string = "PlayerLookup";
    settings = {};
    lookupContextAction : number = 0;

    init(): void {
        this.log("Initializing");
       //  this.lookupContextAction = AddEntityAction('Lookup');
    }
    
    start(): void {
        this.log("Started")
    }

    stop(): void {
        this.log("Stopped")
    }

    // EntityManager_addOtherPlayer(PlayerPacket : any, entityManager : any) {
    //     const player = entityManager.getPlayerByEntityId(PlayerPacket[0])
    //     entityManager._addTargetActionToEntity(player, this.lookupContextAction, 0)
    // }

    // eG_handleTargetAction(actionNumber : any, targetPlayer : any) {
    //     if (actionNumber === this.lookupContextAction) {
    //         window.open(`https://highspell.com/hiscores/player/${targetPlayer._name}`);
    //     }
    // }
}