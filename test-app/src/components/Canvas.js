import React, {useRef, useEffect, useState} from "react";
import '../App.css'

function draw(ctx, figure, isSelected) {
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(figure.x, figure.y, 100, 100);
    if (isSelected){
        ctx.lineWidth = figure.border;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(figure.x, figure.y, 100, 100);
    }
}

function Canvas() {
    const canvasRef = useRef(null);
    const [canvasRects, setCanvasRects] = useState([]);
    const [selectedRect, setSelectedRect] = useState(null);
    const [currentPos, setCurrentPos] = useState(null);

    const onDragOver = e => {
        e.preventDefault();
    };

    const onDrop = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        const [offsetX, offsetY] = [e.dataTransfer.getData("offsetX"), e.dataTransfer.getData("offsetY")];
        const newCanvasRect = { x: e.clientX-offsetX-canvasOffsetX, y: e.clientY-offsetY-canvasOffsetY};
        setCanvasRects([...canvasRects, newCanvasRect])
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 600, 600);
        canvasRects.forEach(figure => {if (figure !== selectedRect) draw(ctx, figure, false)})
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (selectedRect){
            draw(ctx, selectedRect, true)
        }
    });

    const onMouseDown = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];
        for (let rect of canvasRects) {
            if (mouseX >= rect.x && mouseY >= rect.y && mouseX <= rect.x + 100 && mouseY <= rect.y + 100) {
                setSelectedRect(rect);
                setCurrentPos({x: mouseX, y: mouseY});
                break;
            }
        }

    };

    const onMouseUp = e => {

        setSelectedRect(null)
        setCurrentPos(null)
    };

    const onMouseMove = e => {
        let [canvasOffsetX, canvasOffsetY] = [canvasRef.current.getBoundingClientRect().x, canvasRef.current.getBoundingClientRect().y];
        let [mouseX, mouseY] = [e.clientX-canvasOffsetX, e.clientY-canvasOffsetY];

        if (currentPos){
            let dx = mouseX - currentPos.x;
            let dy = mouseY - currentPos.y;

            let newFigCoords = {x: selectedRect.x + dx, y: selectedRect.y + dy};
            let newFigures = canvasRects.map(fig => {
                if (fig === selectedRect){
                    return newFigCoords
                }
                else {
                    return fig
                }
            });
            setCanvasRects(newFigures);
            setSelectedRect(newFigCoords);
            let newPos = {x: currentPos.x+dx, y: currentPos.y+dy}
            setCurrentPos(newPos)
        }
    };

    return (
        <div className="canvas">
            <canvas
                ref={canvasRef}
                onDragOver={onDragOver}
                onDrop = {onDrop}
                onMouseDown={(e, canvasRef) => onMouseDown(e, canvasRef)}
                onMouseUp = {onMouseUp}
                onMouseMove = {onMouseMove}
                width={600}
                height={600}/>
        </div>
    )
}

export default Canvas