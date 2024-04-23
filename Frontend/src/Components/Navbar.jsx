import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/apiCalls";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";

const Container = styled.div`
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
  background: linear-gradient(to right, #f0f2f5, #d8dce1);
`;

const Wrapper = styled.div`
  height: 70px;
  background-color: #000000;
  border-bottom: 1px solid #007bff;
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
  color: #007bff;
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
  align-items: center;
  justify-content: flex-end;
  flex: 1;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
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

const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
  object-fit: cover;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 70px;
  right: 5px;
  background-color: black;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.3);
  z-index: 1;
`;

const DropdownItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: gray;
  }
`;

const Navbar = () => {
  const loggedUser = useSelector((state) => state.user.currentUser?.data.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = (e) => {
    logout(dispatch).then(() => window.location.reload());
  };

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
          {loggedUser ? (
            <>
              <Link to="/upload-video">
                <MenuItem>
                  <VideoCallOutlinedIcon style={{ fontSize: "35px" }} />
                </MenuItem>
              </Link>
              <div ref={dropdownRef}>
                <MenuItem onClick={toggleDropdown}>
                  <Image
                    src={
                      loggedUser.avatar ||
                      "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png"
                    }
                  />
                </MenuItem>
                {isDropdownOpen && (
                  <DropdownMenu>
                    <Link
                      to="/your-account"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <DropdownItem>Your Account</DropdownItem>
                    </Link>
                    <Link
                      to="/change-password"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <DropdownItem>Change password</DropdownItem>
                    </Link>
                    <Link
                      to="/delete-account"
                      style={{ textDecoration: "none", color: "black" }}
                    >
                      <DropdownItem>Delete account</DropdownItem>
                    </Link>
                    <DropdownItem onClick={handleLogout}>
                      Logout
                      <LogoutIcon fontSize="" />
                    </DropdownItem>
                  </DropdownMenu>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                style={{ textDecoration: "none", color: "black" }}
              >
                <MenuItem>REGISTER</MenuItem>
              </Link>
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "black" }}
              >
                <MenuItem>SIGN IN</MenuItem>
              </Link>
            </>
          )}
        </Right>
      </Wrapper>
    </Container>
  );
};

export default Navbar;
