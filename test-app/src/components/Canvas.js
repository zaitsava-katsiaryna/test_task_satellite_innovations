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
                tmpFig = new Rectangle(item.id, item.background, item.borderRadius, item.x, item.y);
            }
            else {
                tmpFig = new Ellipse(item.id, item.background, item.borderRadius, item.x, item.y);
            }
            figures.push(tmpFig);
        }
        return figures
    }
    return null
}

function deleteSelectedFigure(canvasFigures, selectedFig, setCanvasFigures, setSelectedFig, setCurrentPos){
    console.log('deleting');
    let updatedFigures = canvasFigures.filter(fig => {return fig !== selectedFig});
    setCanvasFigures(updatedFigures);
    setSelectedFig(null);
    setCurrentPos(null);
}


function Canvas() {
    const canvasRef = useRef(null);
    const [canvasFigures, setCanvasFigures] = useState(parseData(localStorage.getItem("canvasFigures")) || []);
    const [selectedFig, setSelectedFig] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);
    const [isCursorOverCanvas, setIsCursorOverCanvas] = useState(false);
    const [display, setDisplay] = useState({display: "none", left: 0, right: 0, background: "green", borderRadius: "0px"});

    const onDragOver = e => {
        e.preventDefault();
    };

    const onDrop = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        const [offsetX, offsetY] = [e.dataTransfer.getData("offsetX"), e.dataTransfer.getData("offsetY")];
        const id = e.dataTransfer.getData("id");
        const [background, borderRadius] = [e.dataTransfer.getData("background"), e.dataTransfer.getData("borderRadius")];

        let newCanvasFigure = null;
        /* Based on the figure type create corresponding object */
        if (id === "rectangle")
            newCanvasFigure = new Rectangle(id, background, borderRadius, e.clientX-offsetX-canvasOffsetX, e.clientY-offsetY-canvasOffsetY);
        else
            newCanvasFigure = new Ellipse(id, background, borderRadius, e.clientX-canvasOffsetX-offsetX, e.clientY-canvasOffsetY-offsetY);
        setCanvasFigures([...canvasFigures, newCanvasFigure])
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        localStorage.setItem("canvasFigures", JSON.stringify(canvasFigures)); // put figures into local storage
        canvasFigures.forEach(figure => {if (figure !== selectedFig) figure.draw(ctx, false)}) // draw figures
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (selectedFig && isCursorOverCanvas){
            selectedFig.draw(ctx, true)  // draw selected figure with border if cursor is over the canvas
        }
    });

    const onMouseDown = e => {
        e.preventDefault();
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];
        for (let fig of canvasFigures) {
            if (fig.isMouseWithinFigure(mouseX, mouseY)) { // if mouse position is within some figure
                setSelectedFig(fig); // update selected figure
                setCurrentPos({x: mouseX, y: mouseY});
            }
        }
    };

    const onMouseUp = e => {
        setSelectedFig(null); // no figure is selected
        setCurrentPos(null);

    };

    const onMouseMove = e => {
        /* handle mouse move within canvas */
        if (currentPos){
            let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
            let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];
            let dx = mouseX - currentPos.x; // delta x
            let dy = mouseY - currentPos.y; // delta y
            let newFig = null;
            if (selectedFig.id === "rectangle"){
                newFig = new Rectangle(selectedFig.id, selectedFig.background, selectedFig.borderRadius,
                    selectedFig.x + dx, selectedFig.y + dy)  // create new rectangle with shifted position
            }
            else {
                newFig = new Ellipse(selectedFig.id, selectedFig.background, selectedFig.borderRadius,
                    selectedFig.x + dx, selectedFig.y + dy) // create new ellipse with shifted position
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


    const onKeyPress = e => {
        console.log('haha')
        if (selectedFig){
            console.log('hey')
            if (e.keyCode === BACKSPACE || e.keyCode === DELETE){ /* if either backspace of delete is pressed */
                /* delete selected figure */
               deleteSelectedFigure(canvasFigures, selectedFig, setCanvasFigures, setSelectedFig, setCurrentPos);
            }
        }
    };

    const onMouseEnter = e => {
        setIsCursorOverCanvas(true);
        setDisplay({display: "none", left: 0, top: 0, borderRadius: 0, background: "blue"});
    };

    const onMouseOut = e => {
        setIsCursorOverCanvas(false);
        if (selectedFig){
            let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
            let [newLeft, newTop] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];
            let newObj = {display: "block", left: newLeft, top: newTop, background: selectedFig.background, borderRadius: selectedFig.borderRadius};
            setDisplay(newObj);
        }
    };

    const fieldMouseUp = e => {
        if (selectedFig) {
            if (!isCursorOverCanvas){
                deleteSelectedFigure(canvasFigures, selectedFig, setCanvasFigures, setSelectedFig, setCurrentPos);
                setDisplay({display: "none", left: 0, top: 0, borderRadius: 0, background: "blue"});
            }
        }
    };

    const fieldMouseMove = e => {
        if (selectedFig) {
            if (!isCursorOverCanvas){
                let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
                let [mouseX, mouseY] = [e.clientX, e.clientY];
                let dx = mouseX - display.left;
                let dy = mouseY - display.top;
                let [newLeft, newTop] = [display.left+dx-canvasOffsetX, display.top+dy-canvasOffsetY];
                setDisplay({display: "block", left: newLeft, top: newTop, background: selectedFig.background, borderRadius: selectedFig.borderRadius});
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
                    onDragOver={onDragOver}
                    onDrop = {onDrop}
                    onMouseDown={(e, canvasRef) => onMouseDown(e, canvasRef)}
                    onMouseUp = {onMouseUp}
                    onMouseMove = {onMouseMove}
                    onMouseOut={onMouseOut}
                    onMouseEnter={onMouseEnter}
                    width={CANVAS_WIDTH}
                    height={CANVAS_HEIGHT}/>
                <div className="clearDiv">
                    <button onClick={() => {
                        localStorage.clear();
                        setCanvasFigures([])
                    }}>Clear</button>
                </div>
                <div style={{left: display.left, top: display.top, display: display.display,
                    background: display.background, borderRadius: display.borderRadius}}
                     className="testDiv" > </div>

            </div>
        </div>

    )
}

export default Canvas