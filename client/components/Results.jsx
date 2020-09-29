import React from 'react';
import styled from 'styled-components';

const StyledResultsDiv = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	flex-direction: row;
	justify-content: space-around;
	align-items: start;
`;


const StyledResult = styled.div`
	font-family: 'Architects Daughter', cursive;	
	display: flex;
	width: auto;
	height: 250px;
	font-size: 26px;
	background-color: green;
	color: white;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	border-radius: 6px;
	padding: 10px;
`;

const StyledSpan = styled.span`
	font-size: 75px;
`;


const Results = (props) => (
  <StyledResultsDiv>
    <StyledResult>
	<p>YOUR RESULTS:</p> 
	<StyledSpan>{props.homeResults}</StyledSpan>
    </StyledResult>
    <StyledResult>
	<p>OPPONENT'S RESULTS:</p> 
	<StyledSpan>{props.oppResults}</StyledSpan>
    </StyledResult>
  </StyledResultsDiv>
)

export default Results;
