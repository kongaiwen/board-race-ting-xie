import styled from 'styled-components';
import React from 'react';
import io from 'socket.io-client'


const StyledHUD = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
`;

class HUD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      gameStarted: false,
      language: 'Chinese'
    };
    this.socket = io('http://3.14.131.38:3000');
    this.handleGameStart = this.handleGameStart.bind(this);
    this.handleNextWord = this.handleNextWord.bind(this);
  }

  componentDidMount() {
    this.socket.on('gameStarted', (newLanguage) => {
      this.setState({
        gameStarted: true,
        language: newLanguage
      })
    })
  }

  // componentDidUpdate() {

  // }

  handleGameStart() {
    this.socket.emit('gameStarted', this.state.language);
    setTimeout(() => {
      this.props.startGame(this.state.language);
    }, 2000);
    this.setState({ gameStarted: true })
  }

  handleNextWord() {
    this.socket.emit('nextWord');
    this.props.goToNextWord();
  }


  render() {
    return (
      <StyledHUD>
        {!this.state.gameStarted &&
          <>
          <select onChange={(e) => this.setState({ language: e.target.value })}>
            <option value="Chinese">Chinese</option>
            <option value="Japanese">Japanese</option>
            <option value="Korean">Korean</option>
          </select>
          <button onClick={this.handleGameStart}>Let's Play!</button>
          </>
        }
        { this.state.gameStarted &&
          <>
          <h1>Current Test:  {this.props.currentTest}</h1>
          <h1>{this.props.currentWordIndex}/3</h1>
          { this.props.resultsAreIn &&
            <>
            <h1>{this.props.targetWords[this.props.currentWordIndex - 1]}</h1>
            <button onClick={this.handleNextWord}>Next Word</button>
            </>
          }
          { !this.props.resultsAreIn &&
          <h1>"{this.props.currentWord}"</h1>
          }
          <h1>{this.props.time}s</h1>
          </>
        }
      </StyledHUD>
    )
  }
}

export default HUD;
