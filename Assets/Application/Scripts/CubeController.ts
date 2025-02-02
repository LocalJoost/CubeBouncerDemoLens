import { AudioComponentPlayManager } from "./AudioComponentPlayManager";

@component
export class CubeController extends BaseScriptComponent {

    @input private bodyComponent: BodyComponent
    @input private bounceCubeSound: AudioComponent
    @input private bounceOtherSound: AudioComponent

    private originalPosition: vec3;
    private originalRotation: quat;
    private cubeId : number;
    private audioComponentPlayManager: AudioComponentPlayManager;
    private lastPlayTime: number = 0;
    private isInitialized: boolean = false;

    onAwake() {
        this.bodyComponent.enabled = false;
        this.bodyComponent.onCollisionEnter.add(this.handleCollisionEnter.bind(this));
    }

    public initialize (id: number, initialPosition: vec3, initialRotation: quat, 
        audioComponentPlayManager:AudioComponentPlayManager) : void {
        if (this.isInitialized) {
            return;
        }
this.audioComponentPlayManager = audioComponentPlayManager;
        this.isInitialized = true;
        this.originalPosition = initialPosition;
        this.originalRotation = initialRotation;
        this.getTransform().setWorldPosition(initialPosition);
        this.getTransform().setWorldRotation(initialRotation);
        this.enableGravity(false);
        this.bodyComponent.enabled = true;
        this.getSceneObject().name= "Cube " + id;
        this.cubeId = id;
    }

    public getID() : number {
        return this.cubeId;
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

    private handleCollisionEnter(eventArgs: CollisionEnterEventArgs) : void {
        if (getTime() - this.lastPlayTime < 1) {
            return;
        }
        this.lastPlayTime = getTime();
        var otherCubeController = eventArgs.collision.collider.getSceneObject().
            getComponent(CubeController.getTypeName());
        if (otherCubeController != null) {
            if(otherCubeController.cubeId < this.cubeId) {
                this.audioComponentPlayManager.addAudioComponent(this.bounceCubeSound);
            }
        } 
        else {
            this.audioComponentPlayManager.addAudioComponent(this.bounceOtherSound);
        }
    }
}
