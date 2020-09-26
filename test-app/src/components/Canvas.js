import React, {useRef, useEffect, useState} from "react";
import '../App.css'
// import {Figure, Rectangle, Ellipse}  from './Figure'
import Ellipse from "./Ellipse"
import Rectangle from "./Rectangle";


function parseData(str){
    if (str){
        let arr = JSON.parse(str);
        let figures = []
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
        return figures;
    }
    return null

}


const figureWidth = 150;
const figureHeight = 75;

function Canvas() {
    const canvasRef = useRef(null);
    const [canvasFigures, setCanvasFigures] = useState(parseData(localStorage.getItem("canvasFigures")) || []);
    const [selectedFig, setSelectedFig] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);

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
        if (id === "rectangle"){
            newCanvasFigure = new Rectangle(id, background, borderRadius, e.clientX-offsetX-canvasOffsetX, e.clientY-offsetY-canvasOffsetY);
        }
        else{
            newCanvasFigure = new Ellipse(id, background, borderRadius, e.clientX-canvasOffsetX-offsetX, e.clientY-canvasOffsetY-offsetY) //TODO: edit x, y
        }
        setCanvasFigures([...canvasFigures, newCanvasFigure])
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 600, 600);
        localStorage.setItem("canvasFigures", JSON.stringify(canvasFigures));
        canvasFigures.forEach(figure => {if (figure !== selectedFig) figure.draw(ctx, false)})

    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (selectedFig){
            selectedFig.draw(ctx, true)
        }
    });

    const onMouseDown = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];
        for (let fig of canvasFigures) {
            if (fig.isMouseWithinFigure(mouseX, mouseY)) {
                setSelectedFig(fig);
                setCurrentPos({x: mouseX, y: mouseY});
                break;
            }
        }

    };

    const onMouseUp = e => {

        setSelectedFig(null)
        setCurrentPos(null)
    };

    const onMouseMove = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];

        if (currentPos){
            let dx = mouseX - currentPos.x;
            let dy = mouseY - currentPos.y;
            let newFig = null;
            if (selectedFig.id === "rectangle"){
                newFig = new Rectangle(selectedFig.id, selectedFig.background, selectedFig.borderRadius,
                    selectedFig.x + dx, selectedFig.y + dy)
            }
            else {
                newFig = new Ellipse(selectedFig.id, selectedFig.background, selectedFig.borderRadius,
                    selectedFig.x + dx, selectedFig.y + dy)
            }
            let newFigures = canvasFigures.map(fig => {
                if (fig === selectedFig){
                    return newFig
                }
                else {

                    return fig
                }
            });
            setCanvasFigures(newFigures);
            setSelectedFig(newFig);
            let newPos = {x: currentPos.x+dx, y: currentPos.y+dy};
            setCurrentPos(newPos)
        }
    };

    const onKeyPress = e => {
        if (selectedFig){

            if (e.keyCode === 8 || e.keyCode === 46){ /* if either backspace of delete is pressed */
                /* delete selected figure */
                let updatedFigures = canvasFigures.filter(fig => {return fig !== selectedFig});
                setCanvasFigures(updatedFigures);
                setSelectedFig(null);
                setCurrentPos(null);
            }
        }

    };
    return (
        <div
            className="canvas"
            onKeyDown={onKeyPress}
            tabIndex="0"
        >
            <canvas
                ref={canvasRef}
                onDragOver={onDragOver}
                onDrop = {onDrop}
                onMouseDown={(e, canvasRef) => onMouseDown(e, canvasRef)}
                onMouseUp = {onMouseUp}
                onMouseMove = {onMouseMove}

                width={600}
                height={600}/>
            <div className="clearDiv">
                <button onClick={() => {
                    localStorage.clear();
                    setCanvasFigures([])
                }}>Clear</button>
            </div>
        </div>
    )
}

export default Canvas