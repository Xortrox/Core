import { ActionState } from "../interfaces/game/actionStates.enum";
import { ContextMenuTypes } from "../interfaces/game/contextMenuTypes.enum";

export class ContextMenuHelper {
    defaultActions = {};
    inventoryActions = {};
    gameWorldActions = {};
    spellActions = {};



    AddDefaultMenuAction(actionName : string) : number {
        return -1;
    }

    AddInventoryItemMenuAction(actionName : string, handleFunction: Function,  actionState : ActionState = ActionState.Any, contextMenuType: ContextMenuTypes) : number {
        const ContextMenuActions = document.client.get('QA');

        if (ContextMenuActions[actionName] !== undefined) {
            return ContextMenuActions[actionName];
        }
    
        ContextMenuActions[ContextMenuActions[actionName] = (Object.keys(ContextMenuActions).length) / 2] = actionName;
        
        // Returns Entity Action Number;
        const actionNumber = (Object.keys(ContextMenuActions).length / 2) - 1

        if (!this.inventoryActions[contextMenuType]) {
            this.inventoryActions[contextMenuType] = {};
        }

        if (!this.inventoryActions[contextMenuType][actionState]) {
            this.inventoryActions[contextMenuType][actionState] = {};
        }

        if (!this.inventoryActions[contextMenuType][actionState][actionName]) {
            this.inventoryActions[contextMenuType][actionState][actionName] = {actionNumber : actionNumber, handleFunctions: [handleFunction]};
        } else {
            this.inventoryActions[contextMenuType][actionState][actionName].handleFunctions.push(handleFunction);
        }

        return actionNumber;
    }

    AddGameWorldMenuAction(actionName : string) : number {
        const ContextMenuActions = document.client.get('VA');
    
        if (ContextMenuActions[actionName] !== undefined) {
            return ContextMenuActions[actionName];
        }
    
        ContextMenuActions[ContextMenuActions[actionName] = (Object.keys(ContextMenuActions).length) / 2] = actionName;
    
        // Returns Entity Action Number;
        const actionNumber = (Object.keys(ContextMenuActions).length / 2) - 1

        this.gameWorldActions[actionName] = actionNumber;

        return actionNumber;
    }

    AddSpellMenuAction(actionName : string) : number {
        return -1;
    }

    inventoryContextHook(inputArguments : any, actions : any, aG : any) : any {
        const e : any = inputArguments[0];
        const t : any = inputArguments[1];
        const i : any = inputArguments[2];
        const n : any = inputArguments[3];
        const r : any = inputArguments[4];
        const s : any = inputArguments[5];

        let output = actions;

        const contextMenuActionsActionsSpecific = this.inventoryActions[ContextMenuTypes.Any][document.highlite.gameHooks.Classes.EntityManager.Instance._mainPlayer._currentState.getCurrentState()];


        // Check if this.inventoryActions has key 'r'
        if (this.inventoryActions[r] !== undefined) {
            const contextMenuActionsContextSpecific = this.inventoryAction[r][ActionState.Any];
            if (contextMenuActionsContextSpecific) {
                for (const [actionName, actionInformation] of Object.entries(contextMenuActionsContextSpecific)) {
                    output.push(aG._contextMenuItemFactory.createInventoryItemContextMenuItem(this.inventoryActionHandler.bind(this), r, actionInformation.actionNumber, i, n, null, 0));
                }
            }
            
            const contextMenuActionsContextSpecificActionSpecific = this.inventoryAction[r][document.highlite.gameHooks.Classes.EntityManager.Instance._mainPlayer._currentState.getCurrentState()];
            if (contextMenuActionsContextSpecificActionSpecific) {
                for (const [actionName, actionInformation] of Object.entries(contextMenuActionsContextSpecificActionSpecific)) {
                    output.push(aG._contextMenuItemFactory.createInventoryItemContextMenuItem(this.inventoryActionHandler.bind(this), r, actionInformation.actionNumber, i, n, null, 0));
                }
            }
        }

        // Check if this.inventoryActions has key 'ContextMenuTypes.Any'
        if (this.inventoryActions[ContextMenuTypes.Any] !== undefined) {
            const contextMenuActions = this.inventoryActions[ContextMenuTypes.Any][ActionState.Any];
            if (contextMenuActions) {
                for (const [actionName, actionInformation] of Object.entries(contextMenuActions)) {
                    output.push(aG._contextMenuItemFactory.createInventoryItemContextMenuItem(this.inventoryActionHandler.bind(this), r, actionInformation.actionNumber, i, n, null, 0));
                }
            }

            const contextMenuActionsActionSpecific = this.inventoryActions[ContextMenuTypes.Any][document.highlite.gameHooks.Classes.EntityManager.Instance._mainPlayer._currentState.getCurrentState()];
            if (contextMenuActionsActionSpecific) {
                for (const [actionName, actionInformation] of Object.entries(contextMenuActionsActionSpecific)) {
                    output.push(aG._contextMenuItemFactory.createInventoryItemContextMenuItem(this.inventoryActionHandler.bind(this), r, actionInformation.actionNumber, i, n, null, 0));
                }
            }
        }

        return output;
    }

    gameWorldContextHook(...args : any) : any {
        console.warn(args);
    }

    inventoryActionHandler(e, i : any) {
        let actionNumber = e.getItemAction();

        // Loop over all the ContextMenuTypes and ActionStates to find the actionNumber
        for (const [conextMenuType, actionStates] of Object.entries(this.inventoryActions)) {
            for (const [actionState, actions] of Object.entries(actionStates)) {
                for (const [actionName, actionInformation] of Object.entries(actions)) {
                    if (actionInformation.actionNumber == actionNumber) {
                        for (const handleFunction of actionInformation.handleFunctions) {
                            handleFunction(e, i);
                        }
                    }
                }
            }
        }
    }

    registerContextHook(sourceClass : string, fnName : string, hookFn : Function) : boolean {
        const self = this;
        const classObject = document.client.get(sourceClass).prototype;

        (function (originalFunction : any) {
            classObject[fnName] = function (...args : Array<unknown>) {
                const originalReturn = originalFunction.apply(this, arguments);
                return hookFn.apply(self, [args, originalReturn, this]);
            }
        }(classObject[fnName]));

        return true;
    }
}


export function AddEntityAction(actionName : string) : number {

}

export function AddInventoryItemAction(actionName: string) : number {

} 