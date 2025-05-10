import { AddInventoryItemAction } from "../helpers/ContextMenuHelpers";
import { Plugin } from "../interfaces/plugin.class";

export class WikiLookup extends Plugin {
    pluginName: string = "WikiLookup";
    settings: { [key: string]: string | number | boolean; } = {};
    lookupContextAction : number = 0;

    init(): void {
        this.log("Initializing");
        this.lookupContextAction = AddInventoryItemAction("Lookup");
    }
    start(): void {
        this.log("Started")
    }
    stop(): void {
        this.log("Stopped");
    }

    AF_addItemToInventory(slot : number, total_slots : number, unknown : number, unknown2 : boolean, unkown3: any, AF : any) {
        if (!AF._items[slot]._def._inventoryActions.includes(this.lookupContextAction)) {
            AF._items[slot]._def._inventoryActions.push(this.lookupContextAction);
        }
    }

    ItemManager_invokeInventoryAction(unknown1: number, actionNumber: number, slotNumber: number, item : any) {
        if (actionNumber == this.lookupContextAction) {
            window.open(`https://highspell.wiki/w/${(item.Def._nameCapitalized).replace(" ", "_")}`);
        }
    }
}