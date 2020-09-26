import React from 'react';
import './App.css';
import Figures from "./components/Figures";
import Canvas from "./components/Canvas"

function App () {
    return (
        <div className="container-drag">
          <Figures/>
          <Canvas/>
        </div>
    );

}

export default App