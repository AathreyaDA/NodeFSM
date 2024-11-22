import VariableStructure from "./VariableStructure"
import Condition from "./Condition"

class EdgeClickComponentInput {
    callbacks: any
    selectedCallbackIndex: number
    speed: number
    variables: VariableStructure[]
    conditions: Condition[]
    calculateResult: (result : boolean) => void; 
    getEdgeClickComponentInfo: (info : EdgeClickComponentInput) => void;

    constructor(object : {
        callbacks: any
        selectedCallbackIndex: number
        speed: number
        variables: VariableStructure[]
        conditions: Condition[]
        calculateResult: (result : boolean) => void
        getEdgeClickComponentInfo: (info : EdgeClickComponentInput) => void
    }){
        this.callbacks = object.callbacks,
        this.selectedCallbackIndex = object.selectedCallbackIndex
        this.speed = object.speed
        this.variables = object.variables
        this.conditions = object.conditions
        this.calculateResult = object.calculateResult
        this.getEdgeClickComponentInfo = object.getEdgeClickComponentInfo;
    }
}

export default EdgeClickComponentInput;