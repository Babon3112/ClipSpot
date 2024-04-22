import "./App.css";
import React from "react";
import Home from "./Pages/Home";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const Container = styled.div``;

const App = () => {
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
