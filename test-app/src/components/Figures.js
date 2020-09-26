import React from 'react';
import '../App.css'

function Figures() {
    let objFigures = [
        {name: "rectangle", background: "blue", borderRadius: "0%"},
        {name: "ellipse", background: "green", borderRadius: "50%"}
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
                    // if (fig.name === "rectangle"){
                    e.dataTransfer.setData("offsetX", e.nativeEvent.offsetX.toString());
                    e.dataTransfer.setData("offsetY", e.nativeEvent.offsetY.toString())
                }}

                    // }
                    // else{
                    //     e.dataTransfer.setData("offsetX", e.nativeEvent.offsetX.toString());
                    //     e.dataTransfer.setData("offsetY", e.nativeEvent.offsetY.toString())}}
                    // }
                    >  </div>)


    });

    return (
        <div className="figures">
            {figures}
        </div>
    )
}

export default Figures;