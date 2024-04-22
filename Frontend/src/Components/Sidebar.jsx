import React from "react";
import styled from "styled-components";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";

const Container = styled.div`
  width: 240px;
  background-color: #1c1f25;
  padding-top: 10px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
`;

const SidebarItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  color: #f1f1f1;
  cursor: pointer;
`;

const Sidebar = () => {
  return (
    <Container>
      <Wrapper>
        <SidebarItem>
          <HomeIcon style={{ marginRight: "10px" }} />
          Home
        </SidebarItem>
        <SidebarItem>
          <ExploreIcon style={{ marginRight: "10px" }} />
          Explore
        </SidebarItem>
        <SidebarItem>
          <SubscriptionsIcon style={{ marginRight: "10px" }} />
          Subscriptions
        </SidebarItem>
      </Wrapper>
    </Container>
  );
};

export default Sidebar;
