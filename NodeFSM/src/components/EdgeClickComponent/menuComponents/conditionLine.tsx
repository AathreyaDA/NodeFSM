import dropDownElement from "./dropdown";
import textInput from "./textInput";
import VariableStructure from "../../Interfaces/VariableStructure";
import Condition from "../../Interfaces/Condition";
import { useEffect, useState } from "react";
// import { createSignal } from "solid-js";


const conditionLine = (variable0? : VariableStructure, variableList? : VariableStructure[], selectedVariable? : Condition) =>{
    var line_id;
    var variableDropdown;

    if(variable0){
        const line_id = Math.floor(Math.random() * 10000);
    return(
        <div id={`${line_id}`}>
            {variable0.name + " "}{typeof(variable0.value) == 'number' ? dropDownElement(['greater than', 'equals', 'lesser than', 'not equals'], 'equals') : dropDownElement(['equals', 'not equals'], 'equals')}{textInput({attribute:"", defaultValue:(typeof variable0.value == "number" ? 0 : "false"), fieldWidth : 5})}<span onClick={()=>{
                var line_element = document.getElementById(`${line_id}`);
                line_element.parentNode.removeChild(line_element);
            }}><b style={{position: "relative", left:"10%", background:"white", "padding-left":'5px', "padding-right":"5px", color:"red", cursor:"pointer"}}>-</b></span>
        </div>
    )
    }
    // setVariable(variableList[0]);
    
    line_id = Math.floor(Math.random() * 10000);
    variableDropdown = dropDownElement(variableList, null, selectedVariable ? selectedVariable.selectedVariableIndex : 0);
    variableDropdown.id = "main_" + line_id;

    var classListValue;
    var isNumber;
    var variable;
    const updateType = () =>{
        // console.log('updated');
        variableDropdown = document.getElementById("main_" + line_id);
        // console.log(variableDropdown.children[0].classList[1])
        classListValue = variableDropdown.children[0].classList[1];
        // console.log("clsv2: " + classListValue);
        variable = classListValue;
    }
    return (
        <div id={`${line_id}`} onClick = {updateType} class="conditionLine">
            {variableDropdown}
            {
                (() => {
                    // Safely access classList[1] using optional chaining and provide a default value
                    if(!classListValue){
                    classListValue =
                        variableDropdown.children[0].classList[1] ?? "{}";
                        // console.log("CLSV: " + variableDropdown.children[0].classList)
                    }
                    // Parse JSON only if valid, and create a new VariableStructure safely
                    variable;
                    try {
                        variable = new VariableStructure(
                            JSON.parse(classListValue)
                        );

                    } catch (e) {
                        variable = { value: null }; // Fallback if JSON is invalid
                        // console.log("error variable: " + JSON.stringify(variable));
                    }
    
                    // Determine dropdown options and default value
                    // console.log("variable: " + JSON.stringify(variable));
                    isNumber = typeof variable.value === "number";
                    
                    // console.log("isNUmber: " + isNumber);
                    const options = isNumber
                        ? ["greater than", "equals", "lesser than", "not equals"]
                        : ["equals", "not equals"];
    
                    return dropDownElement(options, (selectedVariable) ? (selectedVariable.conditionExpression) : "equals");
                })()
            }
            {
                textInput({
                    attribute: "",
                    defaultValue:
                        (selectedVariable) ? (typeof(selectedVariable.checkValue) === "number" ?  selectedVariable.checkValue : ""+ selectedVariable.checkValue ) :((typeof new VariableStructure(
                            JSON.parse(
                                variableDropdown?.children?.[0]?.classList?.[1] ?? "{}"
                            )
                        ).value === "number"
                            ? 0
                            : "false")),
                    fieldWidth: 5,
                })
            }
            <span
                onClick={() => {
                    const lineElement = document.getElementById(`${line_id}`);
                    if (lineElement?.parentNode) {
                        lineElement.parentNode.removeChild(lineElement);
                    }
                }}
            >
                <b
                    style={{
                        position: "relative",
                        left: "10%",
                        background: "white",
                        "padding-left" : "5px",
                        "padding-right": "5px",
                        color: "red",
                        cursor: "pointer",
                    }}
                >
                    -
                </b>
            </span>
        </div>
    );

}

export default conditionLine;