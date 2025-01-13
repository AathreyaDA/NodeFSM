import EdgeClickComponentInput from "./EdgeClickComponentInput";

// class SavedEdge{
interface SavedEdge{
    position: { x0: number, y0: number, x1: number, y1: number };
    edgeInfo?: EdgeClickComponentInput;
    // constructor(object: {
    //     position: { x0: number, y0: number, x1: number, y1: number },
    //     edgeInfo?: EdgeClickComponentInput;
    // }){
    //     this.position = object.position;
    //     this.edgeInfo = object.edgeInfo;
    // }
}

export default SavedEdge;