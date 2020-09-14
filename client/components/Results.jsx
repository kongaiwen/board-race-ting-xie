import React from 'react';
import styled from 'styled-components';

const Results = (props) => (
  <div>
    <h1>Home results: {props.homeResults}</h1>
    <h1> Away results: {props.oppResults}</h1>
  </div>
)

export default Results;