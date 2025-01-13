import conditionLine from './menuComponents/conditionLine';
import dropDownElement from './menuComponents/dropdown';
import textInput from './menuComponents/textInput';
import styles from './styles.module.css'
import MenuOptions from '../Interfaces/MenuOptions';
import VariableStructure from '../Interfaces/VariableStructure';
import Condition from '../Interfaces/Condition';
import EdgeClickComponentInput from '../Interfaces/EdgeClickComponentInput';
import { VariableListObjects, ConditionObjects, calculateConditions, calculateVariableList } from '../TestValues';
import { createSignal , createEffect} from 'solid-js';
import ConditionExpression from '../Interfaces/ConditionExpression';

//This is the menu that is displayed where you can change add/remove conditions, change speed etc..,
function CreateMenu(options: MenuOptions, jsonInput? : EdgeClickComponentInput) 
{
  const variableList = (jsonInput)? jsonInput?.variables : VariableListObjects.map(item => new VariableStructure(item));

  const handleAddCondition = (event : any) => {
    const ref = menuElement;
    ref.appendChild(conditionLine(()=>{handleConditions()}, null, variableList, null) as HTMLElement)
  }
    const menuElement = document.createElement('div');
    menuElement.className = styles.menu;

  
  const calculateJSONInfo = () => {
    var output : EdgeClickComponentInput = null;
    var conditions: Condition[] = []
    const speed = parseFloat(((menuElement.children[2]).getElementsByClassName("_textField_10ylv_41")[0] as HTMLInputElement).value);

    const selectedCallbackIndex = jsonInput.callbacks.findIndex(item => item === (menuElement.children[0].children[0]).textContent);

    const variables = calculateVariableList(null, jsonInput.variables);

    const conditionLineElements = Array.from(menuElement.getElementsByClassName("conditionLine"));
    conditionLineElements.forEach(conditionLineElement => {

      const dropdowns = Array.from(conditionLineElement.getElementsByClassName("dropdown"));
      const variable = JSON.parse(dropdowns[0].children[0].classList[1]);
      const conditionExpression = dropdowns[1].children[0].textContent;
      const checkValue = (conditionLineElement.children[2].children[0] as HTMLInputElement).value;
      conditions[conditions.length] = new Condition({
        selectedVariableIndex: variables.findIndex(item => item.name === variable.name),
        conditionExpression: conditionExpression as ConditionExpression,
        checkValue: (isNaN(Number(checkValue))) ? (checkValue === "true") : parseFloat(checkValue)
      })
    });

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

    //If there are no conditions, default of false will be maintained
    if(conditionLineElements.length === 0){
      return;
    }
    conditionLineElements.forEach(conditionLineElement => {

      const dropdowns = Array.from(conditionLineElement.getElementsByClassName("dropdown"));

      const variable = JSON.parse(dropdowns[0].children[0].classList[1]);
      const conditionExpression = dropdowns[1].children[0].textContent;
      const checkValue = (conditionLineElement.children[2].children[0] as HTMLInputElement).value;

      //This is to calculate the AND of all conditions.
      //There is a bug here for boolean variables, will be fixed
      if(conditionExpression==="equals"){
        result = result && (variable.value == checkValue || variable.value == (checkValue == 'true'));
      }else if(conditionExpression === "not equals"){
        result = result && (variable.value != checkValue || variable.value == (checkValue != 'true'))
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

  //This is to call a check each time the values are changed.
  //Right now it only checks when the textbox value changes, not the dropdown or variable value in the back end. Will be implemented soon.
  createEffect(() => {
    // Add event listeners to relevant elements
    const conditionLineElements = Array.from(menuElement.getElementsByClassName("conditionLine"));
    conditionLineElements.forEach(conditionLineElement => {
      const dropdowns = Array.from(conditionLineElement.getElementsByClassName("dropdown"));
      const input = conditionLineElement.children[2].children[0] as HTMLInputElement;

      dropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', handleConditions);
      });
      input.addEventListener('input', handleConditions);
    });

    // Initial check
    handleConditions();

    // Cleanup event listeners on unmount
    return () => {
      conditionLineElements.forEach(conditionLineElement => {
        const dropdowns = Array.from(conditionLineElement.getElementsByClassName("dropdown"));
        const input = conditionLineElement.children[2].children[0] as HTMLInputElement;

        dropdowns.forEach(dropdown => {
          dropdown.removeEventListener('change', handleConditions);
        });
        input.removeEventListener('input', handleConditions);
      });
    };
  }, Array.from(menuElement.getElementsByClassName("conditionLine")));

    //dropdown
    menuElement.appendChild(<div>{options.name}</div> as HTMLElement);
    const dropdown = dropDownElement(options.items, 'callback: none');
    menuElement.appendChild(dropdown as HTMLElement);
    menuElement.appendChild(<br/> as HTMLElement);
    options.wrapperElement.appendChild(menuElement);
  
    //duration
    menuElement.appendChild(textInput({attribute: "speed", defaultValue: jsonInput ? jsonInput.speed : 1, triggerToggle: ()=>{}}) as HTMLElement);

    menuElement.appendChild(<div onClick={calculateJSONInfo}><b>Conditions:</b> <span onClick={handleAddCondition} style={{
      cursor: 'pointer', 
      "text-align" : 'right',
      position : 'relative',
      left : "15vh"
    }}><b>+</b></span></div> as HTMLElement);
    
    // menuElement.appendChild(conditionLine(null, variableList) as HTMLElement)
    if(jsonInput){
      jsonInput.conditions.forEach((condition : Condition) => {
        menuElement.appendChild(conditionLine(()=>{handleConditions()}, null, variableList, condition) as HTMLElement);});
    }
    else{
      
      menuElement.appendChild(conditionLine(()=>{handleConditions()}, null, variableList, null, ) as HTMLElement);
    }

    menuElement.style.left = `${options.position.x}px`;
    menuElement.style.top = `${options.position.y}px`;
  }
  
  export default CreateMenu;