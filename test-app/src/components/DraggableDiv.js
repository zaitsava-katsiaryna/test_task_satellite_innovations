import React, {useState} from "react";

function DraggableDiv(props) {

    const [pos, setPos] = useState({display: "none", left: 0, top: 0, borderRadius: 0, background: "blue"});
    window.onmousemove = () => {
        let newPos = {display: props.display, left: props.left, top: props.top,
            borderRadius: props.borderRadius, background: props.background};
        setPos(newPos)
    };

    return (
        <div style={{left: pos.left, top: pos.top, display: pos.display, background: pos.background, borderRadius: pos.borderRadius}}
            className="testDiv" > </div>
    )

}

export default DraggableDiv