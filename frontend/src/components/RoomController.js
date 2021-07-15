import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { ApiService } from '../models/ApiServices'
import { Button } from './Styled'
import { usePeerContext } from "../PeerContext";

const Wrapper = styled.div`
  button {
    margin-bottom: 20px;
  }

  .join-room-text {
    font-size: 24px;
  }
`
const RoomListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  width: 100%;
  justify-content: space-between;

  .room-name {
    max-width: calc(100% - 70px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    text-decoration: underline;
  }

  button {
    margin-bottom: 0;
    padding: 5px 16px;
  }
`

const RoomList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`

export const RoomController = ({ setJoined }) => {

  const peer = usePeerContext();
  const [roomList, setRoomList] = useState([]);

  useEffect(() => {
    getRooms();
  }, []);

  const renderRoomListItem = (item) => {
    return <>
      <div className="room-name">{item}</div>
      <Button onClick={() => onClickJoin(item)}>Join</Button>
    </>
  }

  const getRooms = async () => {
    const res = await ApiService.getRooms();
    setRoomList(res.data.rooms);
  }

  const createRoom = async () => {
    await ApiService.createRoom();
    getRooms();
  }

  const onClickJoin = async (roomId) => {
    try {
      let res = await ApiService.requestJoinRoom(roomId, peer.id);
      peer.joinRoom(roomId, () => {
        setJoined(true);
      });
    } catch (err) {
      alert(err.response.data.error);
    }
  }

  return (
    <Wrapper>
      <Button onClick={createRoom}>Create new room</Button>
      <div className="join-room-text">Join room</div>
      <RoomList>
        {roomList.length > 0 && roomList.map((room) => {
          return <RoomListItem key={room.id}>
            {renderRoomListItem(room.roomName)}
          </RoomListItem>
        })}
      </RoomList>
    </Wrapper>
  )
}
