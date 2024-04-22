import React from "react";
import styled from "styled-components";
import Video from "./Video";

const Container = styled.div``;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Videos = () => {
  return (
    <Container>
      <Wrapper>
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
        <Video />
      </Wrapper>
    </Container>
  );
};

export default Videos;
