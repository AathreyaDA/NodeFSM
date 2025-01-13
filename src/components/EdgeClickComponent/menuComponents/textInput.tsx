import styles from '../styles.module.css'
import { createEffect } from 'solid-js'
interface textInputParameters{
    attribute: string,
    defaultValue: number|string
    triggerToggle: ()=>void
    fieldWidth? : number
}
const textInput = (props : textInputParameters) =>{
    const handleInput = ()=>{
        props.triggerToggle();
    }
    return(
            <span>
                {props.attribute + " "} <input type="text" value={props.defaultValue} class={styles.textField} size={props.fieldWidth || 18} onInput={handleInput}/>
            </span>
    )
}

export default textInput;