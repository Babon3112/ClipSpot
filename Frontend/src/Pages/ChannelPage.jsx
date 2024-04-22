import React from "react";
import styled from "styled-components";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import Videos from "../Components/Videos";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  padding: 20px;
  margin: 0 300px;
  background-color: #f9f9f9;
`;

const Channel = styled.div`
  width: 100%;
`;

const ChannelInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
`;

const ChannelName = styled.h2`
  margin-bottom: 10px;
  font-size: 24px;
  color: #333;
`;

const ChannelDescription = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const ChannelProfile = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const CoverImage = styled.img`
  width: 100%;
  height: 200px;
  margin-bottom: 20px;
  border-radius: 12px;
  object-fit: cover;
`;

const ProfileImage = styled.img`
  border-radius: 50%;
  width: 200px;
  height: 200px;
  margin-right: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ChannelStats = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const SubscriberCount = styled.span`
  color: #666;
  font-size: 16px;
`;

const Dot = styled.div`
  margin: 0 10px;
  height: 4px;
  width: 4px;
  background-color: #666;
  border-radius: 50%;
`;

const VideoCount = styled.span`
  color: #666;
  font-size: 16px;
`;

const SubscribeButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #e74c3c;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const ChannelPage = () => {
  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Sidebar />
        <MainContentWrapper>
          <Channel>
            <ChannelInfo>
              <CoverImage
                src="https://via.placeholder.com/1200x200"
                alt="Cover"
              />
              <ChannelProfile>
                <ProfileImage
                  src="https://via.placeholder.com/200"
                  alt="Profile"
                />
                <div>
                  <ChannelName>Channel Name</ChannelName>
                  <ChannelStats>
                    <SubscriberCount>1M subscribers</SubscriberCount>
                    <Dot />
                    <VideoCount>200 videos</VideoCount>
                  </ChannelStats>
                  <ChannelDescription>
                    This is a description of the channel. Here you can add
                    information about the channel's content.
                  </ChannelDescription>
                  <SubscribeButton>Subscribe</SubscribeButton>
                </div>
              </ChannelProfile>
            </ChannelInfo>
            <Videos />
          </Channel>
        </MainContentWrapper>
      </Wrapper>
    </Container>
  );
};

export default ChannelPage;
