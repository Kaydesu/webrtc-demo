const express = require("express");
const router = express.Router();
const { v4: uuid } = require("uuid");

const rooms = [];

router.get("/", (req, res) => {
  res.json({
    data: {
      rooms: rooms,
    }
  });
});

router.get("/create", (req, res) => {
  let newRoomId = uuid();
  rooms.push({
    id: newRoomId,
    roomName: newRoomId,
    users: []
  });
  res.json({
    data: {
      roomId: newRoomId,
    }
  })
});

router.get("/join/", (req, res) => {
  const userId = req.query.userId;
  const roomId = req.query.roomId;
  const index = rooms.findIndex(room => room.id === roomId);
  if (index > -1) {
    const room = rooms[index];
    if (room.users.includes(userId)) {
      return res.status(400).json({
        error: "User already in room"
      })
    }
    rooms[index].users.push(userId);
    return res.json({
      data: {
        userId,
        roomId
      }
    });
  }
})

module.exports = router;