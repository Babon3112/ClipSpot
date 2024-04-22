import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 320px;
  margin: 30px 0 0 20px;
  cursor: pointer;
  transition: transform 0.3s ease;
`;

const Thumbnail = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;

  img {
    border-radius: 10px;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 0.5s ease;

    &:hover {
      transform: scale(1.01);
      border-radius: 0;
    }
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: row;
  padding: 10px 0;
`;

const ChannelImage = styled.div`
  height: 36px;
  width: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 10px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Details = styled.div`
  flex-grow: 1;
  width: calc(100% - 60px);
  overflow: hidden;
`;

const VideoTitle = styled.h3`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #000;
  line-height: 1.4;
  margin-right: 10px;
`;

const ChannelName = styled.p`
  margin: 2px 0;
  font-size: 13px;
  color: #606060;
`;

const VideoInfo = styled.div`
  display: flex;
  align-items: center;
`;

const VideoViews = styled.p`
  margin: 0;
  font-size: 13px;
  color: #606060;
`;

const Dot = styled.div`
  height: 5px;
  width: 5px;
  margin: 0 5px;
  background-color: #606060;
  border-radius: 50%;
`;

const UploadTime = styled.p`
  margin: 0;
  font-size: 13px;
  color: #606060;
`;

const Video = () => {
  return (
    <Container>
      <Thumbnail>
        <img src="https://via.placeholder.com/320x200" alt="Sample Image" />
      </Thumbnail>
      <Info>
        <ChannelImage>
          <img src="https://via.placeholder.com/36" alt="Channel Image" />
        </ChannelImage>
        <Details>
          <VideoTitle>
            How to become Web developer in 2024 || which is best
          </VideoTitle>
          <ChannelName>Arnab Techie</ChannelName>
          <VideoInfo>
            <VideoViews>2M views</VideoViews>
            <Dot />
            <UploadTime>2 hours ago</UploadTime>
          </VideoInfo>
        </Details>
      </Info>
    </Container>
  );
};

export default Video;
