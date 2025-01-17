import { VectorUtils } from "./VectorUtils";
import { HandInputData } from "../../SpectaclesInteractionKit/Providers/HandInputData/HandInputData";
import { HandType } from "../../SpectaclesInteractionKit/Providers/HandInputData/HandType";
import TrackedHand from "../../SpectaclesInteractionKit/Providers/HandInputData/TrackedHand"

@component
export class HandSmasher extends BaseScriptComponent {
    @input forceMultiplier: number = 100;
    @input smashAreaSize: number = 10;
    @input projectionDistanceMultiplier: number = 2;

    private handProvider: HandInputData = HandInputData.getInstance();
    private leftHand = this.handProvider.getHand("left" as HandType);
    private rightHand = this.handProvider.getHand("right" as HandType);
    private probe = Physics.createGlobalProbe();

    private previousLeftPosition: vec3;
    private previousRightPosition: vec3;

    onAwake() {
        this.createEvent("UpdateEvent").bind(() => {
            this.onUpdate();
        })
    }

    onUpdate() {
        this.previousLeftPosition = this.applySmashMovement(this.leftHand, this.previousLeftPosition);
        this.previousRightPosition = this.applySmashMovement(this.rightHand, this.previousRightPosition);
    }

    private applySmashMovement(hand: TrackedHand, previousPostion: vec3): vec3 {
        const currentPosition = hand.indexKnuckle.position;
        this.tryApplyForceFromVectors(previousPostion, currentPosition);
        return currentPosition != null ? currentPosition : previousPostion
    }

    private tryApplyForceFromVectors(previousPostion: vec3, currentPosition: vec3) {
        if (previousPostion == null || currentPosition == null) {
            return;
        }
        const handVector = currentPosition.sub(previousPostion);
        this.probe.sphereCastAll(this.smashAreaSize, currentPosition,
            currentPosition.add(handVector.mult(VectorUtils.scalar3(this.projectionDistanceMultiplier))),
            (hits: RayCastHit[]) => {
                for (const hit of hits) {
                    const objectHit = hit.collider.getSceneObject();
                    const bodyComponent = objectHit.getComponent("Physics.BodyComponent") as BodyComponent
                    if( bodyComponent != null){
                        const force = handVector.mult(VectorUtils.scalar3(handVector.length * this.forceMultiplier));
                        bodyComponent.addForce(force, Physics.ForceMode.Impulse);
                    }
                }
            });
    }
}
