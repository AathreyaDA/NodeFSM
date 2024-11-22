import Condition from "./Interfaces/Condition";
import EdgeClickComponentInput from "./Interfaces/EdgeClickComponentInput";
import VariableStructure from "./Interfaces/VariableStructure";
import ConditionExpression from "./Interfaces/ConditionExpression";

export const VariableListObjects = [
    {name: "varA", value: 10} ,
    {name: "varB", value: 20},
    {name: "varC", value: true}
  ]

 export const calculateVariableList = (jsonInput : EdgeClickComponentInput, defaultVariables : VariableStructure[])  => {
    return (jsonInput)? jsonInput?.variables : defaultVariables.map(item => new VariableStructure(item));
}

export const ConditionObjects = [
    {
      selectedVariableIndex: 1,
      conditionExpression: "not equals",
      checkValue: 4
    },
    {
      selectedVariableIndex: 2,
      conditionExpression: "equals",
      checkValue: true
    },
    {
      selectedVariableIndex: 0,
      conditionExpression: "greater than",
      checkValue: 5
    }
    ]

export const calculateConditions = (jsonInput : EdgeClickComponentInput, defaultConditions : Condition[]) => {
    return (jsonInput) ? jsonInput.conditions.map(item => new Condition({
        selectedVariableIndex : item.selectedVariableIndex,
        conditionExpression : item.conditionExpression as ConditionExpression,
        checkValue : item.checkValue
      })) : defaultConditions.map(item => new Condition({
        selectedVariableIndex : item.selectedVariableIndex,
        conditionExpression : item.conditionExpression as ConditionExpression,
        checkValue : item.checkValue
      }));
}