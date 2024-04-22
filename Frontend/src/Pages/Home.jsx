import React from "react";
import Navbar from "../Components/Navbar";
import styled from "styled-components";
import Sidebar from "../Components/Sidebar";
import Videos from "../Components/Videos";

const Container = styled.div``;

const Wrapper = styled.div`
  display: flex;
`;

const Home = () => {
  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Sidebar />
        <Videos />
      </Wrapper>
    </Container>
  );
};

export default Home;
