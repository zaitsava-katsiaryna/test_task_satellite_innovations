import React from 'react';
import '../App.css'

function Figures() {
    let figures = [
        <div
            draggable
            key='1'
            className="draggable"
            style={{background: "lightblue", borderRadius: "0%"}}
            onDragStart={e =>{ console.log('Drag start'); e.dataTransfer.setData("id", '1');
                e.dataTransfer.setData("offsetX", e.nativeEvent.offsetX.toString());
                e.dataTransfer.setData("offsetY", e.nativeEvent.offsetY.toString())}}
            onClick = {e => {console.log(e.clientX, e.nativeEvent.offsetX)}}
        >

        </div>
    ];
    return (
        <div className="figures">
            {figures}
        </div>
    )
}

export default Figures;