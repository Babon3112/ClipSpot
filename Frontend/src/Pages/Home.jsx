import React from "react";
import Navbar from "../Components/Navbar";
import styled from "styled-components";
import Sidebar from "../Components/Sidebar";
import VideoList from "../Components/VideoList";

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
        <VideoList />
      </Wrapper>
    </Container>
  );
};

export default Home;
