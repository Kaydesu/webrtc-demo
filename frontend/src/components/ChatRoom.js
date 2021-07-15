import React, { useState } from 'react'
import styled from 'styled-components';
import { RoomController } from './RoomController';
import { RoomMeeting } from './RoomMeeting';

export const Layout = styled.div`
  display: flex;
  width: 100%;
  height: calc(100vh - 20px);
  background-color: #232343;
  color: #fff;
  padding: 10px 0;
  .layout-split {
    width: 50%;
    padding: 20px;
    &:nth-child(1) {
      border-right: 1px solid #485265;
    }
  }
`;

export const ChatRoom = () => {

  const [joined, setJoined] = useState(false);

  return (
    <Layout>
      <div className="layout-split">
        <RoomController setJoined={setJoined} />
      </div>
      <div className="layout-split">
        <RoomMeeting joined={joined} setJoined={setJoined} />
      </div>
    </Layout>
  )
}
