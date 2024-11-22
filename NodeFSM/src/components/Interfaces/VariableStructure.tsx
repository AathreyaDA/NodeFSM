class VariableStructure{
    name: string
    value: number|boolean

    constructor(object : {name: string, value : number |boolean }){
        this.name = object.name,
        this.value = object.value
    }
}

export default VariableStructure;