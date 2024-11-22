import conditionLine from './menuComponents/conditionLine';
import dropDownElement from './menuComponents/dropdown';
import textInput from './menuComponents/textInput';
import styles from './styles.module.css'
import MenuOptions from '../Interfaces/MenuOptions';
import VariableStructure from '../Interfaces/VariableStructure';
import Condition from '../Interfaces/Condition';
import EdgeClickComponentInput from '../Interfaces/EdgeClickComponentInput';
import { VariableListObjects, ConditionObjects, calculateConditions, calculateVariableList } from '../TestValues';
import { createSignal } from 'solid-js';
import ConditionExpression from '../Interfaces/ConditionExpression';

function CreateMenu(options: MenuOptions, jsonInput? : EdgeClickComponentInput) 
{
  const variableList = (jsonInput)? jsonInput?.variables : VariableListObjects.map(item => new VariableStructure(item));

  const handleAddCondition = (event : any) => {
    const ref = menuElement;
    ref.appendChild(conditionLine(null, variableList) as HTMLElement)
  }
    const menuElement = document.createElement('div');
    menuElement.className = styles.menu;

  const calculateJSONInfo = () => {
    var output : EdgeClickComponentInput = null;
    var conditions: Condition[] = []
    const speed = parseFloat(((menuElement.children[2]).getElementsByClassName("_textField_10ylv_41")[0] as HTMLInputElement).value);
    // const selectedCallbackIndex = 
    const selectedCallbackIndex = jsonInput.callbacks.findIndex(item => item === (menuElement.children[0].children[0]).textContent);
    // console.log("speed: " + speed, typeof speed);
    const variables = calculateVariableList(null, jsonInput.variables);

    const conditionLineElements = Array.from(menuElement.getElementsByClassName("conditionLine"));
    conditionLineElements.forEach(conditionLineElement => {
      // calculateConditions()
      const dropdowns = Array.from(conditionLineElement.getElementsByClassName("dropdown"));
      // jsonInput.variables.findIndex(new VariableStructure(variable))
      const variable = JSON.parse(dropdowns[0].children[0].classList[1]);
      const conditionExpression = dropdowns[1].children[0].textContent;
      const checkValue = (conditionLineElement.children[2].children[0] as HTMLInputElement).value;
      conditions[conditions.length] = new Condition({
        selectedVariableIndex: variables.findIndex(item => item.name === variable.name),
        conditionExpression: conditionExpression as ConditionExpression,
        checkValue: (isNaN(Number(checkValue))) ? (checkValue === "true") : parseFloat(checkValue)
      })
    });
    // console.log(((menuElement.children[2]).getElementsByClassName("_textField_10ylv_41")[0] as HTMLInputElement).value);
    // (Array.from(menuElement.children[3])
    output = new EdgeClickComponentInput({
      callbacks : jsonInput.callbacks,
      selectedCallbackIndex: selectedCallbackIndex,
      speed : speed,
      variables: jsonInput.variables,
      conditions: conditions,
      calculateResult: jsonInput.calculateResult,
      getEdgeClickComponentInfo: jsonInput.getEdgeClickComponentInfo
    })
    jsonInput.getEdgeClickComponentInfo(output);
  }


  const handleConditions = () => {
    let result = true;

    const conditionLineElements = Array.from(menuElement.getElementsByClassName("conditionLine"));
    conditionLineElements.forEach(conditionLineElement => {

      const dropdowns = Array.from(conditionLineElement.getElementsByClassName("dropdown"));

      const variable = JSON.parse(dropdowns[0].children[0].classList[1]);
      const conditionExpression = dropdowns[1].children[0].textContent;
      const checkValue = (conditionLineElement.children[2].children[0] as HTMLInputElement).value;

      if(conditionExpression==="equals"){
        result = result && (variable.value == checkValue);
      }else if(conditionExpression === "not equals"){
        result = result && (variable.value != checkValue)
      }
      else if(conditionExpression === "greater than"){
        result = result && (variable.value > checkValue);
      }
      else{
        result = result && (variable.value < checkValue);
      }
    });

    jsonInput.calculateResult(result);
  }
    //dropdown
    const dropdown = dropDownElement(options.items, 'callback: none');
    menuElement.appendChild(dropdown as HTMLElement);
    menuElement.appendChild(<br/> as HTMLElement);
    options.wrapperElement.appendChild(menuElement);
  
    //duration
    menuElement.appendChild(textInput({attribute: "speed", defaultValue: jsonInput ? jsonInput.speed : 1}) as HTMLElement);

    menuElement.appendChild(<div onClick={calculateJSONInfo}><b>Conditions:</b> <span onClick={handleAddCondition} style={{
      cursor: 'pointer', 
      "text-align" : 'right',
      position : 'relative',
      left : "15vh"
    }}><b>+</b></span></div> as HTMLElement);
    
    // menuElement.appendChild(conditionLine(null, variableList) as HTMLElement)
    if(jsonInput){
      jsonInput.conditions.forEach((condition : Condition) => {
        menuElement.appendChild(conditionLine(null, variableList, condition) as HTMLElement);});
    }
    else{
      
      menuElement.appendChild(conditionLine(null, variableList) as HTMLElement);
    }

    menuElement.style.left = `${options.position.x}px`;
    menuElement.style.top = `${options.position.y}px`;
  }
  
  export default CreateMenu;