import React from 'react';
import Canvas from './Canvas.jsx';
import $ from 'jquery';
import styled from 'styled-components';
import io from 'socket.io-client';

import Header from './Header.jsx';
import HUD from './HUD.jsx';
import Results from './Results.jsx'



const StyledPage = styled.div`
  display: grid
  height: 100vh;
  width: 100vw;
  background-color: pink;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 2fr 4fr;

`;




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeResults: null,
      oppResults: null,
      timerOn: false,
      sets: [
        'Chinese',
        'Japanese',
        'Korean'
      ],
      englishPrompts: [
        'You', 'I', 'Red'
      ],
      chineseTargets: [
        '你', '我', '红'
      ],
      japaneseTargets: [
        'あなた', 'わたし', 'あかい'
      ],
      koreanTargets: [
        '너', '저', '빨강'
      ]
    };
    this.socket = io('http://3.14.131.38');
    this.sendCanvas = this.sendCanvas.bind(this);
  }

  componentDidMount() {
    this.socket.on('receivedResults', (results) => {
      this.setState({ oppResults: results })
    })
  }


  sendCanvas(canvas) {
    $.post('/images',
    {
      img: canvas.toDataURL()
    },
    (results) => {
      this.socket.emit('receivedResults', results);
      this.setState({ homeResults: results })
    })
  }





  render() {
    return (
      <StyledPage>
        <Header>BOARD RACE! TING XIE!</Header>
        <HUD />
        <Canvas sendCanvas={this.sendCanvas} homeResults={this.state.homeResults}/>
        { !this.state.timerOn && this.state.homeResults && this.state.oppResults &&
          <Results homeResults={this.state.homeResults} oppResults={this.state.oppResults} />
        }
      </StyledPage>
    )
  }
}

export default App;
