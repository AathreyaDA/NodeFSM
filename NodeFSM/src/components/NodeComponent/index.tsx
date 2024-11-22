import { Accessor, Component, For, createEffect, createSignal } from "solid-js";
import styles from "./styles.module.css";

interface NodeProps {
    id: string;
    x: number;
    y: number;
    name : string;
    numberInputs: number;
    numberOutputs: number;
    selected: boolean;
    onMouseDownNode: (id: string, event: any) => void;
    onMouseDownOutput: (outputPositionX: number, outputPositionY: number, nodeId: string, outputIndex: number) => void;
    onMouseEnterInput: (inputPositionX: number, inputPositionY: number, nodeId: string, outputIndex: number) => void;
    onMouseLeaveInput: (nodeId: string, inputIndex: number) => void;
    onMouseRightDownNode : (nodeId : string, event : any)=> void;
}

const NodeComponent: Component<NodeProps> = (props: NodeProps) => {
    // Handlers
    const fixedNumberInput = 2;
    const fixedNumberOutput = 2;
    function handleMouseDownOutput(ref: any, event: any, outputIndex: number) {
        // Disable drag node
        event.stopPropagation();

        const centerX =
            ref.getBoundingClientRect().left + Math.abs(ref.getBoundingClientRect().right - ref.getBoundingClientRect().left) / 2;
        const centerY =
            ref.getBoundingClientRect().top + Math.abs(ref.getBoundingClientRect().bottom - ref.getBoundingClientRect().top) / 2;

        props.onMouseDownOutput(centerX, centerY, props.id, outputIndex);
    }

    function handleMouseEnterInput(ref: any, inputIndex: number) {
        const centerX =
            ref.getBoundingClientRect().left + Math.abs(ref.getBoundingClientRect().right - ref.getBoundingClientRect().left) / 2;
        const centerY =
            ref.getBoundingClientRect().top + Math.abs(ref.getBoundingClientRect().bottom - ref.getBoundingClientRect().top) / 2;

        props.onMouseEnterInput(centerX, centerY, props.id, inputIndex);
    }

    function handleMouseLeaveInput(inputIndex: number) {
        props.onMouseLeaveInput(props.id, inputIndex);
    }

    const handleContextMenu = (event : any) =>{
        event.preventDefault();
    }
    return (
        <div
            class={props.selected ? styles.nodeSelected : styles.node}
            style={{
                transform: `translate(${props.x}px, ${props.y}px)`,
            }}
            onMouseDown={(event: any) => {
                // Prevent click on board
                event.stopPropagation();
                if(event.button === 0){
                    props.onMouseDownNode(props.id, event);
                }
                else{
                    // console.log("RightClicked");
                    // props.onMouseEnterInput(props.x, props.y, props.id, 0);
                    // props.onMouseRightDownNode(props.id, event);
                }
                
            }}
            onContextMenu={handleContextMenu}
        >
            <div ><input type="text" class={styles.nodeTitle} value="State"></input></div>
            <div class={styles.inputsWrapper}>
                {/* <For each={[...Array(Number(props.numberInputs)).keys()]}> */}
                <For each={[...Array(Number(fixedNumberInput)).keys()]}>
                    {(_, index: Accessor<number>) => {
                        let inputRef: any = null;
                        return (
                            <div
                                ref={inputRef}
                                class={styles.input}
                                onMouseEnter={() => handleMouseEnterInput(inputRef, index())}
                                onMouseLeave={() => handleMouseLeaveInput(index())}
                            ></div>
                        );
                    }}
                </For>
            </div>
            <div class={styles.outputsWrapper}>
                <For each={[...Array(Number(fixedNumberOutput)).keys()]}>
                    {(_, index: Accessor<number>) => {
                        let outputRef: any = null;
                        return (
                            <div
                                ref={outputRef}
                                class={styles.output}
                                onMouseDown={(event: any) => handleMouseDownOutput(outputRef, event, index())}
                            ></div>
                        );
                    }}
                </For>
            </div>
        </div>
    );
};
export default NodeComponent;
