import Condition from "./Interfaces/Condition";
import EdgeClickComponentInput from "./Interfaces/EdgeClickComponentInput";
import VariableStructure from "./Interfaces/VariableStructure";
import ConditionExpression from "./Interfaces/ConditionExpression";
import SavedNode from "./Interfaces/SavedNode";
import SavedEdge from "./Interfaces/SavedEdge";

export const VariableListObjects = [
  { name: "varA", value: 10 },
  { name: "varB", value: 20 },
  { name: "varC", value: true }
]

export const calculateVariableList = (jsonInput: EdgeClickComponentInput, defaultVariables: VariableStructure[]) => {
  return (jsonInput) ? jsonInput?.variables : defaultVariables.map(item => new VariableStructure(item));
}

export const ConditionObjects = [
  {
    selectedVariableIndex: 1,
    conditionExpression: "not equals",
    checkValue: 20
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

export const calculateConditions = (jsonInput: EdgeClickComponentInput, defaultConditions: Condition[]) => {
  return (jsonInput) ? jsonInput.conditions.map(item => new Condition({
    selectedVariableIndex: item.selectedVariableIndex,
    conditionExpression: item.conditionExpression as ConditionExpression,
    checkValue: item.checkValue
  })) : defaultConditions.map(item => new Condition({
    selectedVariableIndex: item.selectedVariableIndex,
    conditionExpression: item.conditionExpression as ConditionExpression,
    checkValue: item.checkValue
  }));
}

const savedNodesJSON = [
  {
    id: '1',
    x: 50,
    y: 50,
    name: 'state1',
    numberInputs: 2,
    numberOutputs: 2
  },
  {
    id: '2',
    x: 100,
    y: 100,
    name: 'state2',
    numberInputs: 2,
    numberOutputs: 2
  },
  {
    id: '3',
    x: 300,
    y: 500,
    name: 'state3',
    numberInputs: 2,
    numberOutputs: 2
  }
]

export const savedEdgesJSON : SavedEdge[] = [
  {
    position: {
      x0: 171.60000610351562,
      x1: 101.5999984741211,
      y0: 56.10000228881836,
      y1: 108.0999984741211
    },
    edgeInfo: null
  },
  {
    position: {
      "x0": 221.60000610351562,
      "y0": 106.0999984741211,
      "x1": 300,
      "y1": 509
    },
    edgeInfo: null
  }
]

export const savedNodes = savedNodesJSON.map(element => new SavedNode(element))