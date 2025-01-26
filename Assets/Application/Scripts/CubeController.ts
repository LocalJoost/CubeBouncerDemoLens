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

    public drop(): void    {
        this.enableGravity(true);
    }

    public async revert() : Promise<void> {
        const time = 1;
        this.enableGravity(false);
        var startPosition = this.getTransform().getWorldPosition();
        var startRotation = this.getTransform().getWorldRotation();
        this.bodyComponent.enabled = false;
        var i = 0;
        var rate = 1.0 / time;
        while (i <= 1)
        {
            i += getDeltaTime() * rate;
            this.getTransform().setWorldPosition(vec3.lerp(startPosition, this.originalPosition, i));
            this.getTransform().setWorldRotation(quat.slerp(startRotation, this.originalRotation, i));
            await this.yieldControl();
        }
        this.getTransform().setWorldPosition(this.originalPosition);
        this.getTransform().setWorldRotation(this.originalRotation);
        this.bodyComponent.velocity = new vec3(0, 0, 0);
        this.bodyComponent.angularVelocity = new vec3(0, 0, 0);
        this.bodyComponent.enabled = true;
    }

    private enableGravity(boolean: boolean) {
        var worldSettings = Physics.WorldSettingsAsset.create();
        worldSettings.gravity = new vec3(0, boolean ? -980 : 0, 0);
        this.bodyComponent.worldSettings = worldSettings;
    }

    private yieldControl(): Promise<void> {
        return new Promise(resolve => {
            this.createEvent("UpdateEvent").bind(() => {
                resolve();
            });
        });
    }
}
