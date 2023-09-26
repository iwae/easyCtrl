import { Camera, Canvas, Node } from "cc";

class Globals {
    canvas:Canvas[] = [];
    cameras:Camera[] = [];
    layer2D:Node[]=[];
    layer3D:Node[]=[];
    isPause = false;
}

const GLOBALS = new Globals;

export default GLOBALS;