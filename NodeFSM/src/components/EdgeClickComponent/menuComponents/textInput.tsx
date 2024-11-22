import styles from '../styles.module.css'

interface textInputParameters{
    attribute: string,
    defaultValue: number|string
    fieldWidth? : number
}
const textInput = (props : textInputParameters) =>{
    return(
            <span>
                {props.attribute + " "} <input type="text" value={props.defaultValue} class={styles.textField} size={props.fieldWidth || 18}/>
            </span>
    )
}

export default textInput;