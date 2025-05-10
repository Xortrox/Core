export function AddEntityAction(actionName : string) : number {
    const ContextMenuActions = document.client.get('VA');
    ContextMenuActions[ContextMenuActions[actionName] = (Object.keys(ContextMenuActions).length) / 2] = actionName;

    // Returns Entity Action Number;
    const actionNumber = (Object.keys(ContextMenuActions).length / 2) - 1
    return actionNumber;
}