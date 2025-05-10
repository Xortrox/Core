import { AddEntityAction, AddInventoryItemAction } from "../helpers/ContextMenuHelpers";
import { Plugin } from "../interfaces/plugin.class";

export class WikiLookup extends Plugin {
    pluginName: string = "WikiLookup";
    settings: { [key: string]: string | number | boolean; } = {};
    lookupContextActionInventory : number = 0;
    lookupContextActionEntities : number = 0;

    init(): void {
        this.log("Initializing");
        this.lookupContextActionInventory = AddInventoryItemAction("Lookup");
        this.lookupContextActionEntities = AddEntityAction("Lookup");

    }
    start(): void {
        this.log("Started")
    }
    stop(): void {
        this.log("Stopped");
    }

    AF_addItemToInventory(slot : number, total_slots : number, unknown : number, unknown2 : boolean, unkown3: any, AF : any) {
        if (!AF._items[slot]._def._inventoryActions.includes(this.lookupContextActionInventory)) {
            AF._items[slot]._def._inventoryActions.push(this.lookupContextActionInventory);
        }
    }

    ItemManager_invokeInventoryAction(unknown1: number, actionNumber: number, slotNumber: number, item : any) {
        if (actionNumber == this.lookupContextActionInventory) {
            window.open(`https://highspell.wiki/w/${(item.Def._nameCapitalized).replace(" ", "_")}`);
        }
    }
}