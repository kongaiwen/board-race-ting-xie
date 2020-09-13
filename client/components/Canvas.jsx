import React from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.div`
  border: 2px solid black;
  width: 600px;
  height: 300px;
`;

// const Canvas = (props) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     context.fillStyle = '#000000'
//     context.fillRect(0, 0, context.canvas.width, context.canvas.height)

//   }, [])

//   return <canvas ref={canvasRef} />
// }

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      mouseDown: false
    };
    this.canvasRef = React.createRef();
    this.canvas = '';
    this.context = '';

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentDidMount() {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');

    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, this.context.canvas.width, this.context.canvas.height);
  }

  handleMouseDown(e) {

    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    this.setState({ mouseDown: true });
    this.context.beginPath();
    this.context.lineWidth = 2;
    this.context.lineCap = 'round';
    this.context.strokeStyle = 'black';

    this.context.moveTo(this.state.x, this.state.y);
    this.context.beginPath();
  }

  handleMouseUp(e) {
    this.setState({
      mouseDown: false
    })
  }

  handleMouseMove(e) {
    this.canvas = this.canvasRef.current;
    this.context = this.canvas.getContext('2d');
    if (this.state.mouseDown) {
      this.context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      this.context.stroke();
    }


    this.setState({
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY
    })
  }


  render() {
    return (
        <StyledCanvas>
          <canvas ref={this.canvasRef} onMouseMove={this.handleMouseMove} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} height="300px" width="600px" />
          <button onClick={() => this.props.sendCanvas(this.canvas)}>Send</button>
        </StyledCanvas>
    )
  }
}


export default Canvas;