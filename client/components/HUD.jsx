import styled from 'styled-components';
import React from 'react';


const StyledHUD = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  width: 100%;
  height: 100%;
`;

class HUD extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  render() {
    return (
      <StyledHUD>This is the HUD</StyledHUD>
    )
  }
}

export default HUD;