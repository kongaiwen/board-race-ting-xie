import React from 'react';
import Canvas from './Canvas.jsx';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.sendCanvas = this.sendCanvas.bind(this);
  }

  sendCanvas(canvas) {
    $.post('/images', {
      img: canvas.toDataURL()
    })
  }


  render() {
    return (
      <div>
        <Canvas sendCanvas={this.sendCanvas} />
        <Canvas sendCanvas={this.sendCanvas} />
      </div>
    )
  }
}

export default App;