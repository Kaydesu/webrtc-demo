import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components';
import { addVideoStream } from '../models/utils';
import { usePeerContext } from '../PeerContext';
import { Button } from './Styled';

const Wrapper = styled.div`
  .info-zone {
    display: flex;
    align-items: flex-start;
    margin-bottom: 20px;
    .info-zone-left {
      width: 200px;
      height: 200px;
      margin-right: 40px;
      video {
        width: 100%;
        height: 100%;
        object-fit: cover;
        background-color: black;
      }
    }
    .info-zone-right {
      flex-grow: 1;
      display: flex;
      justify-content: space-between;
    }
  }

  .guest-zone{
    display: grid;
    grid-template-columns: repeat(auto-fill, 150px);
    grid-auto-rows: 150px;
    grid-gap: 15px;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`

export const RoomMeeting = ({ joined, setJoined }) => {

  const peer = usePeerContext();
  const videoRef = useRef(null);
  const videoGrid = useRef(null);
  const videoList = useRef({});
  const streamIdList = useRef([]);

  useEffect(() => {
    peer.registerStreams(renderPeerVideos);
    peer.onUserDisconnected(removeVideo)
  }, []);

  useEffect(() => {
    if (joined) {
      navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      }).then(stream => {
        peer.stream = stream;
        videoRef.current.muted = true;
        addVideoStream(videoRef.current, stream);
      })
    }
  }, [joined]);

  const removeVideo = (e) => {
    const id = e.detail.userId;
    if (videoList.current[id]) {
      videoList.current[id].remove();
      delete videoList.current[id];
    }
  }

  const renderPeerVideos = (e) => {
    const streams = e.detail.streams;
    const idList = [];
    streams.map((stream) => {
      if (!streamIdList.current.includes(stream.id)) {
        const video = document.createElement("video");
        video.srcObject = stream;
        video.play();
        videoGrid.current.append(video);
        videoList.current[stream.userId] = video;
        idList.push(stream.id);
      }
    })
    streamIdList.current = [...idList]
  }

  const leaveRoom = () => {
    peer.leaveRoom();
    setJoined(false);
    streamIdList.current = [];
  }

  return joined && (
    <Wrapper>
      <div className="info-zone">
        <div className="info-zone-left">
          <video ref={videoRef}></video>
        </div>
        <div className="info-zone-right">
          <div className="room-info">
            <div className="info-label">ROOM ID: </div>
            <div className="info-label">USER ID: </div>
          </div>
          <Button onClick={leaveRoom}> Leave Room </Button>
        </div>
      </div>
      <div ref={videoGrid} className="guest-zone">

      </div>
    </Wrapper>
  )
}
