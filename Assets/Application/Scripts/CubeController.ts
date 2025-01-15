@component
export class CubeController extends BaseScriptComponent {

    @input private bodyComponent: BodyComponent

    private originalPosition: vec3;
    private originalRotation: quat;
    private isInitialized: boolean = false;

    onAwake() {
        this.bodyComponent.enabled = false;
    }

    public initialize (id: number, initialPosition: vec3, 
                       initialRotation: quat) : void {
        if (this.isInitialized) {
            return;
        }
        this.isInitialized = true;
        this.originalPosition = initialPosition;
        this.originalRotation = initialRotation;
        this.getTransform().setWorldPosition(initialPosition);
        this.getTransform().setWorldRotation(initialRotation);
        this.enableGravity(false);
        this.bodyComponent.enabled = true;
        this.getSceneObject().name= "Cube " + id;
    }

    private enableGravity(boolean: boolean) {
        var worldSettings = Physics.WorldSettingsAsset.create();
        worldSettings.gravity = new vec3(0, boolean ? -980 : 0, 0);
        this.bodyComponent.worldSettings = worldSettings;
    }
}
