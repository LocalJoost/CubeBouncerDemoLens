import WorldCameraFinderProvider from "../../SpectaclesInteractionKit/Providers/CameraProvider/WorldCameraFinderProvider"
import { CubeController } from "./CubeController";
import { VectorUtils } from "./VectorUtils";

@component
export class CubeManager extends BaseScriptComponent {

    @input private cubePrefab: ObjectPrefab;

    private camera = WorldCameraFinderProvider.getInstance();
    private readonly SIZE = 20;
    private readonly MAXX = 25
    private readonly MAXY = 25
    private readonly MAXZ = 70  
    private readonly START_DISTANCE = 80
    private cubes: CubeController[] = [];

    onAwake() {
        const delayedEvent = this.createEvent("DelayedCallbackEvent");
        delayedEvent.bind(() => {
            this.createNewGrid();
        });
        delayedEvent.reset(1);
    }

    public createNewGrid() :void{
        for (const cube of this.cubes) {
            cube.getSceneObject().destroy();
        }
        this.cubes = [];

        const forward = this.camera.getTransform().forward;
        const right = this.camera.getTransform().right;
        const up = this.camera.getTransform().up;
        const startPostion = this.camera.getTransform().getWorldPosition().
                                sub(forward.mult(VectorUtils.scalar3(this.START_DISTANCE)));
        const rotation = this.camera.getTransform().getWorldRotation();
        
        var id = 0;
        for (var z = 0; z <= this.MAXZ; z += this.SIZE) {
            for (var x = -this.MAXX; x <= this.MAXX; x += this.SIZE) {
                for (var y = -this.MAXY; y <= this.MAXY; y += this.SIZE) {
                    this.createCube(id++,
                        startPostion.add(forward.mult(VectorUtils.scalar3(-z))).add(
                            right.mult(VectorUtils.scalar3(x))).add(up.mult(VectorUtils.scalar3(y))),
                        rotation);
                }
            }
        }
    }

    private createCube(id: number, position: vec3, rotation: quat) {
        const clone = this.cubePrefab.instantiate(this.getSceneObject());
        var cubeController = clone.getComponent(CubeController.getTypeName()) as CubeController;
        cubeController.initialize(id++, position, rotation);
        this.cubes.push(cubeController);
    }
}
