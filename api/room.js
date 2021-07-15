const express = require("express");
const { v4: uuid } = require("uuid");


class RoomManager {
  constructor() {
    this.rooms = [];
    this.router = express.Router();
    this.configRoute();
  }

  static initalize() {
    return new RoomManager();
  }

  configRoute() {
    this.router.get("/", (req, res) => {
      res.json({
        data: {
          rooms: this.rooms,
        }
      });
    });

    this.router.get("/create", (req, res) => {
      let newRoomId = uuid();
      this.rooms.push({
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

    this.router.get("/join/", (req, res) => {
      const userId = req.query.userId;
      const roomId = req.query.roomId;
      const index = this.rooms.findIndex(room => room.id === roomId);
      if (index > -1) {
        const room = this.rooms[index];
        if (room.users.includes(userId)) {
          return res.status(400).json({
            error: "User already in room"
          })
        }
        this.rooms[index].users.push(userId);
        return res.json({
          data: {
            userId,
            roomId
          }
        });
      }
    })
  }

  removeUser(userId) {
    this.rooms.map(room => {
      const index = room.users.findIndex(id => id === userId);
      console.log(userId);
      if (index > -1) {
        room.users.splice(index, 1);
      }
    })
  }
}


module.exports = RoomManager;