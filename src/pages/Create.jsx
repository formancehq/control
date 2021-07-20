import * as React from 'react';
import styled from 'styled-components';
import Navbar from '../parts/Navbar.jsx';

const Wrapper = styled.div``;

function Create() {
  return (
    <Wrapper>
      <Navbar></Navbar>
      <div className="top-container">
        <h1>Create</h1>
      </div>
    </Wrapper>
  )
}

export default Create;