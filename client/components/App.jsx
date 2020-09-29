import React from 'react';
import Canvas from './Canvas.jsx';
import $ from 'jquery';
import styled from 'styled-components';
import io from 'socket.io-client';

import Header from './Header.jsx';
import HUD from './HUD.jsx';
import Results from './Results.jsx'



const StyledPage = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  background-color: pink;
  grid-template-columns: 1fr;
  grid-template-rows: 75px auto 350px auto;
`;




class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      homeResults: null,
      oppResults: null,
      playerOnePoints: 0,
      playerTwoPoints: 0,
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
      ],
      currentTest: 'Chinese',
      currentWord: 'You',
      currentWordIndex: 0,
      time: 20,
      timerComplete: false,
      resultsAreIn: false
    };
    this.socket = io('http://3.14.131.38:3000');
    this.sendCanvas = this.sendCanvas.bind(this);
    this.startGame = this.startGame.bind(this);
    this.goToNextWord = this.goToNextWord.bind(this);
    this.compareResults = this.compareResults.bind(this);
  }

  componentDidMount() {
    this.socket.once('receivedResults', (results) => {
      this.compareResults();
      this.setState({
        oppResults: results,
        resultsAreIn: true,
        currentWordIndex: this.state.currentWordIndex + 1,
        currentWord: this.state.englishPrompts[this.state.currentWordIndex],
        time: 20
       })

    })
    this.socket.on('gameStarted', (language) => {
      this.startGame(language);
    })

    this.socket.on('nextWord', this.goToNextWord);
  }

  goToNextWord() {
    if (this.state.currentWordIndex < 2) {
      this.setState({
        currentWordIndex: this.state.currentWordIndex + 1,
        currentWord: this.state.englishPrompts[this.state.currentWordIndex],
        resultsAreIn: false,
        timerComplete: false,
        playerOneCorrect: false,
        playerTwoCorrect: false
      })
    }
  }

  compareResults() {
    console.log(this.state[this.state.currentTest.toLowerCase()+'Targets'][this.state.currentWordIndex])
    if (this.state.homeResults === this.state[this.state.currentTest.toLowerCase()+'Targets'][this.state.currentWordIndex]) {
      this.setState({
        playerOnePoints: this.state.playerOnePoints + 1,
        playerOneCorrect: true
       })
    }
    if (this.state.oppResults === this.state[this.state.currentTest.toLowerCase()+'Targets'][this.state.currentWordIndex]) {
      this.setState({
        playerTwoPoints: this.state.playerTwoPoints + 1,
        playerTwoCorrect: true
       })
    }
  }

  sendCanvas(canvas) {
    $.post('/images',
    {
      img: canvas.toDataURL()
    },
    (results) => {
      this.socket.emit('receivedResults', results);
      this.setState({
        homeResults: results,
        timerComplete: false
      })
    })
  }

  startGame(language) {
    this.setState({
      currentTest: language,
      currentWord: this.state.englishPrompts[0],
      currentWordIndex: 0
    })

    let start = Date.now();
    this.timer = setInterval(() => {
      let delta = Date.now() - start;
      if (delta >= 20000) {
        clearInterval(this.timer);
        this.setState({
          timerComplete: true,
          time: 0
        })
      } else {
        this.setState({
          time: 20 - Math.floor(delta / 1000)
        })
      }
    }, 500)
  }






  render() {
    return (
      <StyledPage>
        <Header><h1>BOARD RACE!  TING XIE!</h1></Header>
        <HUD currentTest={this.state.currentTest} currentWordIndex={this.state.currentWordIndex} currentWord={this.state.currentWord} time={this.state.time} startGame={this.startGame} resultsAreIn={this.state.resultsAreIn} targetWords={this.state[this.state.currentTest.toLowerCase()+'Targets']} goToNextWord={this.goToNextWord} playerOnePoints={this.state.playerOnePoints} playerTwoPoints={this.state.playerTwoPoints} />
        <Canvas currentTest={this.state.currentTest} sendCanvas={this.sendCanvas} homeResults={this.state.homeResults} timerComplete={this.state.timerComplete}/>
        { !this.state.timerOn && this.state.homeResults && this.state.oppResults &&
          <Results homeResults={this.state.homeResults} oppResults={this.state.oppResults} playerOneCorrect={this.state.playerOneCorrect} playerTwoCorrect={this.state.playerTwoCorrect} />
        }
      </StyledPage>
    )
  }
}

export default App;
