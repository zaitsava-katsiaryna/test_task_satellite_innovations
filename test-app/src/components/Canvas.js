import React, {useRef, useEffect, useState} from "react";
import '../App.css'
import Ellipse from "./Ellipse"
import Rectangle from "./Rectangle";

const DELETE = 46;
const BACKSPACE = 8;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

function parseData(str){
    if (str){
        let arr = JSON.parse(str);
        let figures = [];
        for (let item of arr){
            let tmpFig = null;
            if (item.id === "rectangle"){
                tmpFig = new Rectangle(item.id, item.background, item.borderRadius, item.x, item.y, item.offsetX, item.offsetY);
            }
            else {
                tmpFig = new Ellipse(item.id, item.background, item.borderRadius, item.x, item.y, item.offsetX, item.offsetY);
            }
            figures.push(tmpFig);
        }
        return figures
    }
    return null
}

function deleteSelectedFigure(canvasFigures, selectedFig, setCanvasFigures, setSelectedFig, setCurrentPos){
    let updatedFigures = canvasFigures.filter(fig => {return fig !== selectedFig});
    setCanvasFigures(updatedFigures);
    setSelectedFig(null);
    setCurrentPos(null);
}


function Canvas() {
    const canvasRef = useRef(null); // canvas reference
    const [canvasFigures, setCanvasFigures] = useState(parseData(localStorage.getItem("canvasFigures")) || []); // figures displayed on the canvas
    const [selectedFig, setSelectedFig] = useState(null); // selected figure
    const [currentPos, setCurrentPos] = useState(null); // current position of the selected figure
    const [isCursorOverCanvas, setIsCursorOverCanvas] = useState(false); // cursor position (over / not over canvas)
    const [draggableFig, setDraggableFig] = useState({display: "none", left: 0, right: 0, background: "green", borderRadius: "0px"}); // figure that is displayed when figure is selected and cursor is outside canvas

    // draw all canvas figures except selected one
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        localStorage.setItem("canvasFigures", JSON.stringify(canvasFigures)); // put figures into local storage
        canvasFigures.forEach(figure => {if (figure !== selectedFig) figure.draw(ctx, false)}) // draw figures
    });

    // draw selected figure
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (selectedFig && isCursorOverCanvas){
            selectedFig.draw(ctx, true)  // draw selected figure with border if cursor is over the canvas
        }
    });

    // handle mouse-enter-canvas event
    const onMouseEnter = e => {
        setIsCursorOverCanvas(true);
        setDraggableFig({display: "none", left: 0, top: 0, borderRadius: 0, background: "blue"}); // draggable figure is not visible
    };

    // handle mouse-leave-canvas event
    const onMouseOut = e => {
        setIsCursorOverCanvas(false);
        if (selectedFig){
            let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
            let [newLeft, newTop] = [e.clientX-canvasOffsetX-selectedFig.offsetX, e.clientY-canvasOffsetY-selectedFig.offsetY];
            let newObj = {display: "block", left: newLeft, top: newTop, background: selectedFig.background, borderRadius: selectedFig.borderRadius};
            setDraggableFig(newObj);
        }
    };

    const onDragOver = e => {
        e.preventDefault();
    };

    // handle drop the element event (when dragging from Figures to Canvas)
    const onDrop = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y]; // canvas offset
        const [offsetX, offsetY] = [e.dataTransfer.getData("offsetX"), e.dataTransfer.getData("offsetY")]; // cursor offset
        const id = e.dataTransfer.getData("id");
        const [background, borderRadius] = [e.dataTransfer.getData("background"), e.dataTransfer.getData("borderRadius")];

        let newCanvasFigure = null;
        /* Based on the figure type create corresponding object */
        if (id === "rectangle")
            newCanvasFigure = new Rectangle(id, background, borderRadius, e.clientX-offsetX-canvasOffsetX, e.clientY-offsetY-canvasOffsetY,
                offsetX, offsetY);
        else
            newCanvasFigure = new Ellipse(id, background, borderRadius, e.clientX-canvasOffsetX-offsetX, e.clientY-canvasOffsetY-offsetY,
                offsetX, offsetY);
        setCanvasFigures([...canvasFigures, newCanvasFigure])
    };

    // handle mouse-down-on-canvas event
    const onMouseDown = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];
        for (let fig of canvasFigures) {
            if (fig.isMouseWithinFigure(mouseX, mouseY)) { // if mouse position is within some figure
                setSelectedFig(fig); // update selected figure
                setCurrentPos({x: mouseX, y: mouseY});
            }
        }
    };

    // handle mouse-up-on-canvas event
    const onMouseUp = e => {

        setSelectedFig(null); // no figure is selected
        setCurrentPos(null);

    };

    // handle mouse-move-over-canvas event
    const onMouseMove = e => {
        if (currentPos){
            let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y]; // canvas offset
            let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY]; // cursor offset
            let dx = mouseX - currentPos.x; // delta x
            let dy = mouseY - currentPos.y; // delta y
            let newFig = null;
            if (selectedFig.id === "rectangle"){
                newFig = new Rectangle(selectedFig.id, selectedFig.background, selectedFig.borderRadius,
                    selectedFig.x + dx, selectedFig.y + dy, selectedFig.offsetX, selectedFig.offsetY)  // create new rectangle with shifted position
            }
            else {
                newFig = new Ellipse(selectedFig.id, selectedFig.background, selectedFig.borderRadius,
                    selectedFig.x + dx, selectedFig.y + dy, selectedFig.offsetX, selectedFig.offsetY) // create new ellipse with shifted position
            }
            // update figures array
            let newFigures = canvasFigures.filter(fig => {
                return fig !== selectedFig;
            });
            newFigures.push(newFig);

            setCanvasFigures(newFigures);
            setSelectedFig(newFig);
            let newPos = {x: currentPos.x+dx, y: currentPos.y+dy};
            setCurrentPos(newPos)
        }

    };

    // handle delete on key press if cursor is within canvas
    const onKeyPress = e => {
        console.log('tut')
        if (isCursorOverCanvas && selectedFig){
            if (e.keyCode === BACKSPACE || e.keyCode === DELETE){ /* if either backspace of delete is pressed */
                /* delete selected figure */
               deleteSelectedFigure(canvasFigures, selectedFig, setCanvasFigures, setSelectedFig, setCurrentPos);
            }
        }
    };


    // handle mouse-up event outside the canvas
    const fieldMouseUp = e => {
        if (selectedFig) {
            if (!isCursorOverCanvas){
                deleteSelectedFigure(canvasFigures, selectedFig, setCanvasFigures, setSelectedFig, setCurrentPos);
                setDraggableFig({display: "none", left: 0, top: 0, borderRadius: 0, background: "blue"});
            }
        }
    };

    // handle mouse-move event outside the canvas
    const fieldMouseMove = e => {

        if (selectedFig) {
            if (!isCursorOverCanvas){
                let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
                let [mouseX, mouseY] = [e.clientX, e.clientY];
                let dx = mouseX - draggableFig.left;
                let dy = mouseY - draggableFig.top;
                let [newLeft, newTop] = [draggableFig.left+dx-canvasOffsetX-selectedFig.offsetX, draggableFig.top+dy-canvasOffsetY];
                setDraggableFig({display: "block", left: newLeft, top: newTop, background: selectedFig.background, borderRadius: selectedFig.borderRadius});
            }
        }
    };

    return (
      <div
           className="backgroundDiv"
          onMouseUp={fieldMouseUp}
          onMouseMove={fieldMouseMove}
       >
            <div
                className="canvas"
                onKeyDown={onKeyPress}
                tabIndex="0"
            >
                <div className="headerText">Canvas</div>
                <canvas
                    ref={canvasRef}
                    onDrop = {onDrop}
                    onMouseDown={(e, canvasRef) => onMouseDown(e, canvasRef)}
                    onMouseUp = {onMouseUp}
                    onMouseMove = {onMouseMove}
                    onMouseOut={onMouseOut}
                    onMouseEnter={onMouseEnter}
                    onDragOver={onDragOver}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}/>
                <div className="clearDiv">
                    <button onClick={e => {
                        localStorage.clear();
                        setCanvasFigures([])
                    }}>Clear</button>
                </div>
                <div style={{left: draggableFig.left, top: draggableFig.top, display: draggableFig.display,
                background: draggableFig.background, borderRadius: draggableFig.borderRadius}}
                className="draggableDiv" > </div>

            </div>
         </div>

    )
}

export default Canvas