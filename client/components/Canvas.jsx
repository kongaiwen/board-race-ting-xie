import React from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import Results from './Results.jsx'

const StyledContainer = styled.div`
  grid-row: 3 / 4;
  grid-column: 1 / 2;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
`;


const StyledCanvasOne = styled.div`
  border: 2px solid black;
  width: 600px;
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: space-around;
`;

const StyledCanvasOpp = styled.div`
border: 2px solid black;
width: 600px;
height: 300px;
display: flex;
flex-direction: column;
justify-content: space-around;
align-items: space-around;
`;

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      mouseDown: false,
      opponentX: 0,
      opponentY: 0,
      opponentMouseDown: false,
      timerOn: false,
    };
    this.socket = io('http://localhost:3000');

    this.canvasRef = React.createRef();
    this.canvas = '';
    this.context = '';

    this.oppCanvasRef = React.createRef();
    this.oppCanvas = '';
    this.oppContext = '';

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleOppMouseDown = this.handleOppMouseDown.bind(this);
    this.handleOppMouseMove = this.handleOppMouseMove.bind(this);
    this.handleOppMouseUp = this.handleOppMouseUp.bind(this);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');

    this.oppCanvas = this.oppCanvasRef.current;
    this.oppContext = this.oppCanvas.getContext('2d');

    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    this.oppContext.fillStyle = 'white';
    this.oppContext.fillRect(0, 0, this.oppContext.canvas.width, this.oppContext.canvas.height);

    this.socket.on('mouseDown', (coords) => {
      this.setState({ opponentMouseDown: true });
      this.handleOppMouseDown(coords);
    })

    this.socket.on('mouseMove', (coords) => {
      this.handleOppMouseMove(coords);
    })

    this.socket.on('mouseUp', () => {
      this.handleOppMouseUp();
    });
  }

  handleMouseDown(e) {

    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    this.setState({ mouseDown: true });
    // this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = 'black';

    // send data to other sockets
    this.socket.emit('mouseDown', { x: this.state.x, y: this.state.y });

    this.context.moveTo(this.state.x, this.state.y);
    this.context.beginPath();
  }

  handleOppMouseDown(coords) {
    this.oppCanvas = this.oppCanvasRef.current;
    this.oppContext = this.oppCanvas.getContext('2d');
    this.setState({ opponentMouseDown: true });
    // this.oppContext.beginPath();
    this.oppContext.lineWidth = 2;
    this.oppContext.lineCap = 'round';
    this.oppContext.strokeStyle = 'red';

    this.oppContext.moveTo(coords.x, coords.y);
    this.oppContext.beginPath();
  }

  handleMouseUp(e) {
    this.setState({
      mouseDown: false
    })
    this.socket.emit('mouseUp');
  }

  handleOppMouseUp() {
    this.setState({ opponentMouseDown: false });
  }

  handleMouseMove(e) {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    if (this.state.mouseDown) {
      this.socket.emit('mouseMove', { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      this.context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      this.context.stroke();
    }

    this.setState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    })
  }

  handleOppMouseMove(coords) {
    this.oppCanvas = this.oppCanvasRef.current;
    this.oppContext = this.oppCanvas.getContext('2d');
    this.oppContext.lineTo(coords.x, coords.y);
    this.oppContext.stroke();
  }


  render() {
    return (
        <StyledContainer>
          <StyledCanvasOne>
            <canvas ref={this.canvasRef} onMouseMove={this.handleMouseMove} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} height="300px" width="600px" />
            <button onClick={() => this.props.sendCanvas(this.canvas)}>Send</button>
          </StyledCanvasOne>
          <StyledCanvasOpp>
            <canvas ref={this.oppCanvasRef} height="300px" width="600px" />
            <button onClick={() => this.props.sendCanvas(this.canvas)}>Send</button>
        </StyledCanvasOpp>
      </StyledContainer>
    )
  }
}


export default Canvas;