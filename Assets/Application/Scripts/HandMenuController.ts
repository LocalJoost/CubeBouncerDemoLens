import { CubeManager } from "./CubeManager"
import { Interactable } from "../../SpectaclesInteractionKit/Components/Interaction/Interactable/Interactable"
@component
export class HandMenuController extends BaseScriptComponent {

    @input createNewGridButton: SceneObject;
    @input dropAllButton: SceneObject;
    @input revertAllButton: SceneObject;
    @input cubeManager:  CubeManager;

    onAwake() {
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.initializeButtons();
        });
        delayedEvent.reset(1);
    }

    private initializeButtons() {
        this.addTrigger(this.createNewGridButton, this.cubeManager.createNewGrid.bind(this.cubeManager));
        this.addTrigger(this.dropAllButton, this.cubeManager.dropAll.bind(this.cubeManager));
        this.addTrigger(this.revertAllButton, this.cubeManager.revertAll.bind(this.cubeManager));
    }

    private addTrigger(button: SceneObject, callback: () => void) {
        var interactable = button.getComponent(Interactable.getTypeName()) as Interactable;
        interactable.onTriggerEnd.add(callback); 
    }
}
