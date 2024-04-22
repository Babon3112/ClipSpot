import React from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

const Container = styled.div`
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  background: linear-gradient(to right, #f0f2f5, #d8dce1);
`;

const Wrapper = styled.div`
  height: 70px;
  background-color: #1c1f25;
  color: #f0f2f5;
  display: flex;
  align-items: center;
  padding: 0 30px;
  transition: all 0.3s ease;
`;

const Left = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
`;

const Logo = styled.h1`
  margin: 0;
  color: #00c6ff;
  font-size: 28px;
  font-weight: bold;
  font-family: "Montserrat", sans-serif;
  letter-spacing: 1.5px;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  flex: 2;
`;

const SearchContainer = styled.div`
  width: 65%;
  display: flex;
  align-items: center;
  background-color: #1c1f25;
  border: 1px solid gray;
  border-radius: 25px;
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const Input = styled.input`
  width: 85%;
  border: none;
  outline: none;
  font-size: 14px;
  margin-left: 10px;
  background-color: transparent;
  padding-right: 5px;
  border-right: 1px solid lightgray;
  color: #f0f2f5;

  &:hover {
    background-color: transparent;
  }
`;

const IconContainer = styled.div`
  width: 15%;
  display: flex;
  justify-content: center;
  padding: 8px;
  border-radius: 0 25px 25px 0;
  background-color: #1c1f25;
  transition: background-color 0.3s ease;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  flex: 1;
`;

const MenuItem = styled.div`
  margin-left: 20px;
  padding: 10px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;
  color: #f0f2f5;
  font-weight: 600;

  &:hover {
    color: #00c6ff;
  }
`;

const Navbar = () => {
  return (
    <Container>
      <Wrapper>
        <Left>
          <Logo>VidVerse</Logo>
        </Left>
        <Center>
          <SearchContainer>
            <Input placeholder="Search" id="search" />
            <IconContainer>
              <SearchIcon style={{ color: "white" }} />
            </IconContainer>
          </SearchContainer>
        </Center>
        <Right>
          <MenuItem>Register</MenuItem>
          <MenuItem>SIGN IN</MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
