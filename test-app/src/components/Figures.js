import React from 'react';
import '../App.css'

function Figures() {
    let objFigures = [
        {name: "ellipse", background: "blue", borderRadius: "50%"},
        {name: "rectangle", background: "green", borderRadius: "0%"}
    ];

    let figures = [];
    objFigures.forEach((fig) => {
        figures.push(
            <div
                draggable
                key={fig.name}
                className="draggable"
                style={{background: fig.background, borderRadius: fig.borderRadius}}
                onDragStart={e => {
                    e.dataTransfer.setData("id", fig.name);
                    e.dataTransfer.setData("borderRadius", fig.borderRadius);
                    e.dataTransfer.setData("background", fig.background);
                    e.dataTransfer.setData("offsetX", e.nativeEvent.offsetX.toString()); // offset to the figure left border
                    e.dataTransfer.setData("offsetY", e.nativeEvent.offsetY.toString()) // offset to the figure top border
                }}
            >  </div>)
    });

    return (
        <div className="figures">
            <div className="headerText">Figures</div>
            <div style={{marginTop: "80px"}}>
                {figures}
            </div>

        </div>
    )
}

export default Figures;