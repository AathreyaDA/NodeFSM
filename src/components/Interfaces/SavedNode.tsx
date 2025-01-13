class SavedNode{
    id: string;
    x: number;
    y: number;
    name : string;
    numberInputs: number;
    numberOutputs: number;
    constructor(object: {
        id: string,
        x: number,
        y: number,
        name : string,
        numberInputs: number,
        numberOutputs: number,
    }){
        this.id = object.id;
        this.x = object.x;
        this.y = object.y;
        this.name = object.name;
        this.numberInputs = object.numberInputs;
        this.numberOutputs = object.numberOutputs;
    }
}

export default SavedNode;