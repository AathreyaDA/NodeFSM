import { Accessor, Component, For, Index, Setter, createSignal, onMount, createEffect } from "solid-js";
import NodeComponent from "../NodeComponent";
import ButtonsComponent from "../ButtonsComponent";
import styles from "./styles.module.css";
import EdgeComponent from "../EdgeComponent";
import RightClickMenu from "../RightClickMenu.jsx"
import EdgeClickComponentInput from "../Interfaces/EdgeClickComponentInput";
import SavedNode from "../Interfaces/SavedNode";
import { savedNodes } from "../TestValues";
import SavedEdge from "../Interfaces/SavedEdge";
const options = [
    { text: 'Option 1', callback: () => console.log('Option 1 clicked') },
    { text: 'Option 2', callback: () => console.log('Option 2 clicked') },
  ];
  
//Node class
interface Node {
    id: string;
    numberInputs: number;
    numberOutputs: number;
    name? : string;
    prevPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    currPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    inputEdgeIds: { get: Accessor<string[]>; set: Setter<string[]> };
    outputEdgeIds: { get: Accessor<string[]>; set: Setter<string[]> };
}

//Variable Structure, used for determining type of trigger
interface VariableStructure{
    name: string
    value: number|boolean
}

//For the whole board
interface BoardInput{
    variablesList : VariableStructure[]
    nodes : Node[]
    edges : Edge[]
}
interface Edge {
    id: string;
    nodeStartId: string;
    nodeEndId: string;
    inputIndex: number;
    outputIndex: number;
    prevStartPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    currStartPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    prevEndPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    currEndPosition: { get: Accessor<{ x: number; y: number }>; set: Setter<{ x: number; y: number }> };
    result?: boolean
}

const BoardComponent: Component = (props : BoardInput) => {
    // Signals

    //For moving around the board
    const [grabbingBoard, setGrabbingBoard] = createSignal<boolean>(false);
    const [selectedNode, setSelectedNode] = createSignal<string | null>(null);
    const [selectedEdge, setSelectedEdge] = createSignal<string | null>(null);
    const [newEdge, setNewEdge] = createSignal<Edge | null>(null);

    //This is to stop other movements when typing node name
    const [insideInput, setInsideInput] = createSignal<{
        nodeId: string;
        inputIndex: number;
        positionX: number;
        positionY: number;
    } | null>(null);

    const [clickedPosition, setClickedPosition] = createSignal<{ x: number; y: number }>({ x: -1, y: -1 });

    const [nodes, setNodes] = createSignal<Node[]>([]);
    const [edges, setEdges] = createSignal<Edge[]>([]);
    const [scale, setScale] = createSignal<number>(1);
    //These are for future use where transitions can be created from right click instead of pre-built positions
    const [rightClickActive, setRightClick] = createSignal<Boolean>(false);
    const [transitioning, setTransitioning] = createSignal<Boolean>(false);
    const [currentState, setCurrentState] = createSignal<Node>(null);
    //For future use, to identify how many nodes were loaded from saves
    const [loadNumber, setLoadNumber] = createSignal<Number>(0);


    onMount(() => {
        const boardElement = document.getElementById("board");

        if (boardElement) {
            boardElement.addEventListener(
                "wheel",
                (event) => {
                    // Update scale
                    setScale(scale() + event.deltaY * -0.005);

                    // Restrict scale
                    setScale(Math.min(Math.max(1, scale()), 2));

                    // Apply scale transform
                    boardElement.style.transform = `scale(${scale()})`;
                    boardElement.style.marginTop = `${(scale() - 1) * 50}vh`;
                    boardElement.style.marginLeft = `${(scale() - 1) * 50}vw`;
                },
                { passive: false }
            );
        }

        loadSavedNodes(savedNodes);
    });

    const showState = () => {
        console.log("current state: ", currentState() ? currentState().name : null);
    }
    

    // Handlers
    function handleOnMouseDownBoard(event: any) {
        // Deselect node
        setSelectedNode(null);

        // Deselect edge
        setSelectedEdge(null);

        // Start grabbing board
        setGrabbingBoard(true);
        setClickedPosition({ x: event.x, y: event.y });
        setRightClick(false);
    }

    function handleOnMouseUpBoard() {
        setClickedPosition({ x: -1, y: -1 });

        // Stop grabbing board
        setGrabbingBoard(false);

        // If a new edge is being set and is not inside input
        if (newEdge() !== null && insideInput() === null) {
            setNewEdge(null);
        }

        // If a new edge is being set and is inside input
        if (newEdge() !== null && insideInput() !== null) {
            const nodeStartId = newEdge()!.nodeStartId;
            const nodeEndId = insideInput()!.nodeId;

            const nodeStart = nodes().find((node) => node.id === nodeStartId);
            const nodeEnd = nodes().find((node) => node.id === nodeEndId);

            const boardWrapperElement = document.getElementById("boardWrapper");

            if (nodeStart && nodeEnd && boardWrapperElement) {
                const edgeId = `edge_${nodeStart.id}_${newEdge()?.outputIndex}_${nodeEnd.id}_${insideInput()?.inputIndex}`;

                if (nodeStart.outputEdgeIds.get().includes(edgeId) && nodeEnd.inputEdgeIds.get().includes(edgeId)) {
                    setNewEdge(null);
                    return;
                }

                nodeStart.outputEdgeIds.set([...nodeStart.outputEdgeIds.get(), edgeId]);
                nodeEnd.inputEdgeIds.set([...nodeEnd.inputEdgeIds.get(), edgeId]);

                // Update edge current positions
                newEdge()!.prevStartPosition.set((_) => {
                    return {
                        x: (newEdge()!.currStartPosition.get().x + boardWrapperElement.scrollLeft) / scale(),
                        y: (newEdge()!.currStartPosition.get().y + boardWrapperElement.scrollTop) / scale(),
                    };
                });

                newEdge()!.prevEndPosition.set((_) => {
                    return {
                        x: (insideInput()!.positionX + boardWrapperElement.scrollLeft) / scale(),
                        y: (insideInput()!.positionY + boardWrapperElement.scrollTop) / scale(),
                    };
                });

                newEdge()!.currEndPosition.set((_) => {
                    return {
                        x: (insideInput()!.positionX + boardWrapperElement.scrollLeft) / scale(),
                        y: (insideInput()!.positionY + boardWrapperElement.scrollTop) / scale(),
                    };
                });

                // Add new edge
                setEdges([
                    ...edges(),
                    {
                        ...newEdge()!,
                        id: edgeId,
                        nodeEndId: nodeEnd.id,
                        nodeEndInputIndex: insideInput()!.inputIndex,
                    },
                ]);
                setNewEdge(null);
            }
        }
    }

    function handleOnMouseMove(event: any) {
        // User clicked somewhere
        if (clickedPosition().x >= 0 && clickedPosition().y >= 0) {
            // User clicked on node
            if (selectedNode() !== null) {
                const deltaX = event.x - clickedPosition().x;
                const deltaY = event.y - clickedPosition().y;

                const node = nodes().find((node) => node.id === selectedNode());
                if (node) {
                    // Update node position
                    node.currPosition.set((_) => {
                        return {
                            x: (node.prevPosition.get().x + deltaX) / scale(),
                            y: (node.prevPosition.get().y + deltaY) / scale(),
                        };
                    });

                    // Update input edges positions
                    for (let i = 0; i < node.inputEdgeIds.get().length; i++) {
                        const edgeId = node.inputEdgeIds.get()[i];
                        const edge = edges().find((edge) => edge.id === edgeId);
                        if (edge) {
                            edge.currEndPosition.set((_) => {
                                return {
                                    x: (edge.prevEndPosition.get().x + deltaX) / scale(),
                                    y: (edge.prevEndPosition.get().y + deltaY) / scale(),
                                };
                            });
                        }
                    }

                    // Update output edges positions
                    for (let i = 0; i < node.outputEdgeIds.get().length; i++) {
                        const edgeId = node.outputEdgeIds.get()[i];
                        const edge = edges().find((edge) => edge.id === edgeId);
                        if (edge) {
                            edge.currStartPosition.set((_) => {
                                return {
                                    x: (edge.prevStartPosition.get().x + deltaX) / scale(),
                                    y: (edge.prevStartPosition.get().y + deltaY) / scale(),
                                };
                            });
                        }
                    }
                }
            }
            // User clicked on board, move board
            else {
                const deltaX = event.x - clickedPosition().x;
                const deltaY = event.y - clickedPosition().y;

                const boardWrapperElement = document.getElementById("boardWrapper");
                if (boardWrapperElement) {
                    boardWrapperElement.scrollBy(-deltaX, -deltaY);
                    setClickedPosition({ x: event.x, y: event.y });
                }
            }
        }

        // User is setting new edge
        if (newEdge() !== null) {
            const boardWrapperElement = document.getElementById("boardWrapper");
            if (boardWrapperElement) {
                newEdge()?.currEndPosition.set({
                    x: (event.x + boardWrapperElement.scrollLeft) / scale(),
                    y: (event.y + +boardWrapperElement.scrollTop) / scale(),
                });
            }
        }
    }

    function handleOnMouseDownNode(id: string, event: any) {
        // Deselect edge
        setSelectedEdge(null);

        // Select node
        setSelectedNode(id);
        // Update first click position
        setClickedPosition({ x: event.x, y: event.y });

        const node = nodes().find((node) => node.id === selectedNode());
        if (node) {
            // Update node position
            node.prevPosition.set((_) => {
                return { x: node.currPosition.get().x * scale(), y: node.currPosition.get().y * scale() };
            });
            // console.log(node.inputEdgeIds.get());
            // Update input edges positions
            for (let i = 0; i < node.inputEdgeIds.get().length; i++) {
                const edgeId = node.inputEdgeIds.get()[i];
                const edge = edges().find((edge) => edge.id === edgeId);
                if (edge) {
                    edge.prevEndPosition.set((_) => {
                        return { x: edge.currEndPosition.get().x * scale(), y: edge.currEndPosition.get().y * scale() };
                    });
                }
            }

            // Update output edges positions
            for (let i = 0; i < node.outputEdgeIds.get().length; i++) {
                const edgeId = node.outputEdgeIds.get()[i];
                const edge = edges().find((edge) => edge.id === edgeId);
                if (edge) {
                    edge.prevStartPosition.set((_) => {
                        return { x: edge.currStartPosition.get().x * scale(), y: edge.currStartPosition.get().y * scale() };
                    });
                }
            }
        }
    }

    //This is for future use, to create transitions from right click
    function handleOnMouseRightDownNode(id : string, event : any){
        // console.log("Right Clicked");
        setTransitioning(true);
        setRightClick(true);
    }
    //To add nodes
    function handleOnClickAdd(numberInputs: number, numberOutputs: number) {
        // Create random positions
        const randomX = Math.random() * window.innerWidth;
        const randomY = Math.random() * window.innerHeight;

        // Create signal
        const [nodePrev, setNodePrev] = createSignal<{ x: number; y: number }>({ x: randomX, y: randomY });
        const [nodeCurr, setNodeCurr] = createSignal<{ x: number; y: number }>({ x: randomX, y: randomY });
        const [inputsEdgesIds, setInputsEdgesIds] = createSignal<string[]>([]);
        const [outputsEdgesIds, setOutputsEdgesIds] = createSignal<string[]>([]);

        // Update global nodes array
        setNodes([
            ...nodes(),
            {
                id: `node_${Math.random().toString(36).substring(2, 8)}`,
                numberInputs: numberInputs,
                numberOutputs: numberOutputs,
                prevPosition: { get: nodePrev, set: setNodePrev },
                currPosition: { get: nodeCurr, set: setNodeCurr },
                inputEdgeIds: { get: inputsEdgesIds, set: setInputsEdgesIds },
                outputEdgeIds: { get: outputsEdgesIds, set: setOutputsEdgesIds },
            },
        ]);
        saveNodes();
    }

    //To load nodes from saves
    function loadSavedNodes(savedNodes : SavedNode[]) {
        for(let i=0; i<savedNodes.length; i++){
            let currentNode = savedNodes[i];
            // Create signal
            const [nodePrev, setNodePrev] = createSignal<{ x: number; y: number }>({ x: currentNode.x, y: currentNode.y });
            const [nodeCurr, setNodeCurr] = createSignal<{ x: number; y: number }>({ x: currentNode.x, y: currentNode.y });
            const [inputsEdgesIds, setInputsEdgesIds] = createSignal<string[]>([]);
            const [outputsEdgesIds, setOutputsEdgesIds] = createSignal<string[]>([]);

            // Update global nodes array
            setNodes([
                ...nodes(),
                {
                    id: `${currentNode.id}`,
                    name: currentNode.name,
                    numberInputs: currentNode.numberInputs,
                    numberOutputs: currentNode.numberOutputs,
                    prevPosition: { get: nodePrev, set: setNodePrev },
                    currPosition: { get: nodeCurr, set: setNodeCurr },
                    inputEdgeIds: { get: inputsEdgesIds, set: setInputsEdgesIds },
                    outputEdgeIds: { get: outputsEdgesIds, set: setOutputsEdgesIds },
                },
            ]);
        }
        
    }

    //To save nodes to json, right now just logging
    const saveNodes = () => {
        var tempNodes = nodes();
        var finalNodes = [];
        for(let i = 0; i < tempNodes.length; i++){
            if(tempNodes[i].name)
                finalNodes[finalNodes.length] = tempNodes[i];
            else{
                tempNodes[i].name="state";
                finalNodes[finalNodes.length] = tempNodes[i]
            }
        }
        console.log(finalNodes);
    }

    //To update result of transition edge conditions
    const handleEdgeResult = (edgeId: string, result : boolean) => {
        const edgeID = edges().findIndex((edge) => edge.id === edgeId);
        const updatedEdges = [...edges()];
        updatedEdges[edgeID] = { ...edges()[edgeID], result: result };
        setEdges(updatedEdges);
    }

    //To initialize state. It starts from null and selects first node as start state. Should implement a separate start node.
    createEffect(()=>{
        showState();
        setNextState(currentState());
    })


    //Function to setNext state if an edge from current state is true
    const setNextState = (node : Node) => {
        if(!node){
            if(!nodes()){
                return;
            }
            setCurrentState(nodes()[0])
            return;
        }
        const outputs = node.outputEdgeIds.get();

        const uniqueEdgeIds = outputs.filter((value, index, array) => {
            return array.indexOf(value) === index;
        });

        const uniqueEdges = uniqueEdgeIds.map((edgeId) => edges().find((edge) => edge.id === edgeId)).filter((edge) => edge !== undefined);

        for (let i = 0; i < uniqueEdges.length; i++) {
            if(uniqueEdges[i].result){
                setCurrentState(nodes().find((node) => node.id === uniqueEdges[i].nodeEndId));
                return;
            }
        }

        // Log "hello" for the node
        // console.log("hello");
    }
    
    function handleOnClickDelete() {
        // Find node in global nodes array
        const node = nodes().find((node) => node.id === selectedNode());

        // Check if node exists
        if (!node) {
            setSelectedNode(null);
            return;
        }

        // Delete node edges
        const inputs = node.inputEdgeIds.get();
        const outputs = node.outputEdgeIds.get();

        // Get all unique edges to delete
        const allEdges = [...inputs, ...outputs];
        const uniqueEdges = allEdges.filter((value, index, array) => {
            return array.indexOf(value) === index;
        });

        // Delete edges from correspondent nodes data
        for (let i = 0; i < uniqueEdges.length; i++) {
            const edge = edges().find((edge) => edge.id === uniqueEdges[i]);
            if (edge) {
                const nodeStart = nodes().find((node) => node.id === edge.nodeStartId);
                const nodeEnd = nodes().find((node) => node.id === edge.nodeEndId);

                nodeStart?.outputEdgeIds.set([...nodeStart.outputEdgeIds.get().filter((edgeId) => edgeId !== uniqueEdges[i])]);
                nodeEnd?.inputEdgeIds.set([...nodeEnd.inputEdgeIds.get().filter((edgeId) => edgeId !== uniqueEdges[i])]);

                // Delete edge from global data
                setEdges([...edges().filter((e) => edge.id !== e.id)]);
            }
        }

        // Delete node
        setNodes([...nodes().filter((node) => node.id !== selectedNode())]);
        setSelectedNode(null);
    }

    function handleOnMouseDownOutput(outputPositionX: number, outputPositionY: number, nodeId: string, outputIndex: number) {
        // Deselect node
        setSelectedNode(null);
        // jsonEdge();

        const boardWrapperElement = document.getElementById("boardWrapper");

        if (boardWrapperElement) {
            // Create edge position signals with updated scale value
            const [prevEdgeStart, setPrevEdgeStart] = createSignal<{ x: number; y: number }>({
                x: (outputPositionX + boardWrapperElement.scrollLeft) / scale(),
                y: (outputPositionY + boardWrapperElement.scrollTop) / scale(),
            });
            const [currEdgeStart, setCurrEdgeStart] = createSignal<{ x: number; y: number }>({
                x: (outputPositionX + boardWrapperElement.scrollLeft) / scale(),
                y: (outputPositionY + boardWrapperElement.scrollTop) / scale(),
            });
            const [prevEdgeEnd, setPrevEdgeEnd] = createSignal<{ x: number; y: number }>({
                x: (outputPositionX + boardWrapperElement.scrollLeft) / scale(),
                y: (outputPositionY + boardWrapperElement.scrollTop) / scale(),
            });
            const [currEdgeEnd, setCurrEdgeEnd] = createSignal<{ x: number; y: number }>({
                x: (outputPositionX + boardWrapperElement.scrollLeft) / scale(),
                y: (outputPositionY + boardWrapperElement.scrollTop) / scale(),
            });

            setNewEdge({
                id: "",
                nodeStartId: nodeId,
                outputIndex: outputIndex,
                nodeEndId: "",
                inputIndex: -1,
                prevStartPosition: { get: prevEdgeStart, set: setPrevEdgeStart },
                currStartPosition: { get: currEdgeStart, set: setCurrEdgeStart },
                prevEndPosition: { get: prevEdgeEnd, set: setPrevEdgeEnd },
                currEndPosition: { get: currEdgeEnd, set: setCurrEdgeEnd },
                result  : false
            });
        }
    }

    function handleOnMouseEnterInput(inputPositionX: number, inputPositionY: number, nodeId: string, inputIndex: number) {
        setInsideInput({ nodeId, inputIndex, positionX: inputPositionX, positionY: inputPositionY });
    }

    function handleOnMouseLeaveInput(nodeId: string, inputIndex: number) {
        if (insideInput() !== null && insideInput()?.nodeId === nodeId && insideInput()?.inputIndex === inputIndex) setInsideInput(null);
    }

    function handleOnMouseDownEdge(edgeId: string) {
        // Deselect node
        setSelectedNode(null);

        // Select edge
        setSelectedEdge(edgeId);
    }

    function handleOnDeleteEdge(edgeId: string) {
        const edge = edges().find((e) => e.id === edgeId);

        if (edge) {
            // Delete edge from start node
            const nodeStart = nodes().find((n) => n.id === edge.nodeStartId);
            if (nodeStart) {
                nodeStart.outputEdgeIds.set([...nodeStart.outputEdgeIds.get().filter((edgeId) => edgeId !== edge.id)]);
            }

            // Delete edge from end node
            const nodeEnd = nodes().find((n) => n.id === edge.nodeEndId);
            if (nodeEnd) {
                nodeEnd.inputEdgeIds.set([...nodeEnd.inputEdgeIds.get().filter((edgeId) => edgeId !== edge.id)]);
            }

            // Delete edge from global edges array
            setEdges([...edges().filter((e) => e.id !== edge.id)]);
        }
    }

    //Method to log info of edge's menu (like conditions, speed, etc..,)
    const handleGetJSONInfo = (info : EdgeClickComponentInput) =>{
        console.log(JSON.stringify(info));
        // console.log("component: ", EdgeComponent(null));
    }

    return (
        <div id="boardWrapper" class={styles.wrapper}>
            <ButtonsComponent showDelete={selectedNode() !== null} onClickAdd={handleOnClickAdd} onClickDelete={handleOnClickDelete} />
            <div
                id="board"
                class={grabbingBoard() ? styles.boardDragging : styles.board}
                onMouseDown={handleOnMouseDownBoard}
                onMouseUp={handleOnMouseUpBoard}
                onMouseMove={handleOnMouseMove}
            >
                {/* {rightClickActive() ? <RightClickMenu x={20} y={20}/> : <div style="color: red">Hello</div>} */}
                <For each={nodes()}>
                    {(node: Node) => (
                        <NodeComponent
                            name = {node.name}
                            id={node.id}
                            x={node.currPosition.get().x}
                            y={node.currPosition.get().y}
                            numberInputs={node.numberInputs}
                            numberOutputs={node.numberOutputs}
                            selected={selectedNode() === node.id}
                            onMouseDownNode={handleOnMouseDownNode}
                            onMouseDownOutput={handleOnMouseDownOutput}
                            onMouseEnterInput={handleOnMouseEnterInput}
                            onMouseLeaveInput={handleOnMouseLeaveInput}
                            onMouseRightDownNode = {handleOnMouseRightDownNode}
                        />
                    )}
                </For>
                {newEdge() !== null && (
                    <EdgeComponent
                        startNodeName={nodes().find((node) => node.id === newEdge()!.nodeStartId)?.name}
                        endNodeName={nodes().find((node) => node.id === newEdge()!.nodeEndId)?.name}
                        selected={false}
                        isNew={true}
                        position={{
                            x0: newEdge()!.currStartPosition.get().x,
                            y0: newEdge()!.currStartPosition.get().y,
                            x1: newEdge()!.currEndPosition.get().x,
                            y1: newEdge()!.currEndPosition.get().y,
                        }}
                        onMouseDownEdge={() => {}}
                        onClickDelete={() => {}}
                        getJSONInfo={handleGetJSONInfo}
                        getResult={()=>{}}
                    />
                )}
                {edges().map((edge: Edge, index: number) => (
                    <EdgeComponent
                        startNodeName={newEdge() ? (nodes().find((node) => node.id === newEdge()!.nodeStartId)?.name) : "null"}
                        endNodeName={newEdge() ? nodes().find((node) => node.id === newEdge()!.nodeEndId)?.name : "null"}
                        key={edge.id} // Add a unique key for React reconciliation
                        selected={selectedEdge() === edge.id}
                        isNew={false}
                        position={{
                            x0: edge.currStartPosition.get().x,
                            y0: edge.currStartPosition.get().y,
                            x1: edge.currEndPosition.get().x,
                            y1: edge.currEndPosition.get().y,
                        }}
                        onMouseDownEdge={() => handleOnMouseDownEdge(edge.id)}
                        onClickDelete={() => handleOnDeleteEdge(edge.id)}
                        getJSONInfo={handleGetJSONInfo}
                        getResult={(result: boolean)=>{
                        handleEdgeResult((edges()[index]).id, result)
                        }}
                    />
                ))}

            </div>
            {/* {rightClickActive() ? <div style={{position: "absolute", top:100+"px"}}>HelloRight</div> : <div>Hello</div>} */}
        </div>
    );
};

export default BoardComponent;
