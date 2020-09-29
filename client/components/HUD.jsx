import styled from 'styled-components';
import React from 'react';
import io from 'socket.io-client';



const StyledTestInfo = styled.div`
  display: flex;
  width: 100%;
  height: 100%
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-end;
  color: white;
`;

const StyledBottomRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%
`;

const StyledGameContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%
`;

const StyledSelect = styled.select`
  width: 140px;
  height: 100px;
  font-family: 'Architects Daughter', cursive;
  font-size: 24px;
  justify-text: center;
  align-text: center;
  background-color: green; 
  color: white;
  border: none;
  border-radius: 6px;
`;

const StyledOption = styled.option`
  width: 140px;
  height: 10px;
  font-family: 'Architects Daughter', cursive;
  font-size: 16px;
  background-color: green; 
  color: white;
  border: none;
  border-radius: 6px;
  justify-text: center;
  align-text: center;
`;


const StyledButton = styled.button`
  width: 150px;
  height: 100px;
  font-family: 'Architects Daughter', cursive;
  font-size: 24px;
  justify-text: center;
  background-color: green; 
  color: white;
  align-text: center;
  border: none;
  border-radius: 6px;
`;

const StyledHUD = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  font-family: 'Architects Daughter', cursive;
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
          <StyledSelect onChange={(e) => this.setState({ language: e.target.value })}>
            <StyledOption value="Chinese">CHINESE</StyledOption>
            <StyledOption value="Japanese">JAPANESE</StyledOption>
            <StyledOption value="Korean">KOREAN</StyledOption>
          </StyledSelect>
          <StyledButton onClick={this.handleGameStart}>START RACING!</StyledButton>
          </>
        }
        { this.state.gameStarted &&
          <StyledGameContainer>
		<StyledTestInfo>
		  <h1>CURRENT TEST:  {this.props.currentTest}</h1>
		  <h1>{this.props.currentWordIndex}/3</h1>
		</StyledTestInfo>
		  { this.props.resultsAreIn &&
		    <StyledBottomRow>
			    <StyledButton>{this.props.targetWords[this.props.currentWordIndex - 1]}</StyledButton>
			    <StyledButton onClick={this.handleNextWord}>NEXT WORD</StyledButton>
		    </StyledBottomRow>
		  }
		  { !this.props.resultsAreIn &&
                      <StyledBottomRow>
			  <StyledButton>"{this.props.currentWord}"</StyledButton>
			  <StyledButton>{this.props.time}</StyledButton>
		      </StyledBottomRow>
		  }
          </StyledGameContainer>
        }
      </StyledHUD>
    )
  }
}

export default HUD;
