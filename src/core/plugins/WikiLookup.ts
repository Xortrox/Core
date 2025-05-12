import { AddEntityAction, AddInventoryItemAction } from "../helpers/ContextMenuHelpers";
import { Plugin } from "../interfaces/plugin.class";
import { ActionState } from "../interfaces/game/actionStates.enum";
import { ContextMenuTypes } from "../interfaces/game/contextMenuTypes.enum";

export class WikiLookup extends Plugin {
    pluginName: string = "WikiLookup";
    settings: { [key: string]: string | number | boolean; } = {};
    lookupContextActionInventory : number = 0;
    lookupContextActionEntities : number = 0;

    init(): void {
        this.log("Initializing");
        document.highlite.Helpers.ContextMenu.AddInventoryItemMenuAction("Lookup", this.handleInventoryAction, ActionState.Any, ContextMenuTypes.Any);
    }

    handleInventoryAction(actionInfo : any, clickInfo : any) : any {
        let item = actionInfo.getItem();
        window.open(`https://highspell.wiki/w/${(item.Def._nameCapitalized).replace(" ", "_")}`);
    }

    start(): void {
        this.log("Started")
    }

    stop(): void {
        this.log("Stopped");
    }
}