import ConditionExpression from "./ConditionExpression"

class Condition{
    selectedVariableIndex : number
    conditionExpression : ConditionExpression
    checkValue : number | boolean

    constructor(object : {
        selectedVariableIndex : number,
        conditionExpression : ConditionExpression,
        checkValue : number | boolean
      }){
        this.selectedVariableIndex = object.selectedVariableIndex;
        this.conditionExpression = object.conditionExpression;
        this.checkValue = object.checkValue;
      }
  }

  export default Condition;