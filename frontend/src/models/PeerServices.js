import Peer from "peerjs";
import io from "socket.io-client";
import { ApiService } from "./ApiServices";

export class PeerManager {
  constructor() {
    this._instance = null;
    this.socket = io.connect("http://localhost:5000");
    this.peers = {};
    this.id = "";
    this.stream = null;
    this.remoteStreams = [];
  }

  registerUser(id) {
    this._instance = new Peer(id, {
      host: "/",
      port: "5001"
    });

    this._instance.on("open", id => {
      this.id = id;
    });

    this._instance.on("call", call => {
      this.peers[call.peer] = call;
      call.answer(this.stream);
      call.on("stream", remoteStream => {
        this.addRemoteStream(call.peer, remoteStream);
      })
    })

  }

  connectNewUser(id) {
    const call = this._instance.call(id, this.stream);
    this.peers[id] = call;
    call.on("stream", remoteStream => {
      this.addRemoteStream(id, remoteStream);
    });
  }

  registerStreams(callback) {
    document.addEventListener("onReceiveStreams", callback);
  }

  unRegisterStreams(callback) {
    document.removeEventListener("onReceiveStreams", callback);
  }

  onUserDisconnected(callback) {
    document.addEventListener("onUserDisconnected", callback);
  }

  onNewRoom(callback) {
    this.socket.on("create-room-success", callback);
  }

  dispatchEvent(eventName, data) {
    const event = new CustomEvent(eventName, {
      detail: data
    });
    document.dispatchEvent(event);
  }

  joinRoom(roomId, callback) {
    this.socket.emit("join-room", roomId, this.id);
    callback();

    this.socket.on("user-connected", remoteUserId => {
      setTimeout(this.connectNewUser.bind(this), 500, remoteUserId);
    });

    this.socket.on("user-disconnected", userId => {
      this.peers[userId].close();
      this.dispatchEvent("onUserDisconnected", { userId: userId });
      const index = this.remoteStreams.findIndex(stream => stream.userId === userId);
      if(index > -1) {
        this.remoteStreams.splice(index, 1);
      }
    })
  }

  leaveRoom(roomId, userId) {
    this.socket.emit("leave-room", roomId, this.id);
    this.stream.getTracks()[0].stop();
    this.stream.getTracks()[1].stop();
    this.remoteStreams = [];
  }

  createNewRoom() {
    ApiService.createRoom().then(res => {
      this.socket.emit("alert-create-room")
    }).catch(err => {
      console.log(err);
    })
  }

  addRemoteStream(userId, remoteStream) {
    const index = this.remoteStreams.findIndex(stream => stream.id === remoteStream.id);
    if (index === -1) {
      remoteStream.userId = userId;
      this.remoteStreams.push(remoteStream);
      this.dispatchEvent("onReceiveStreams", { streams: this.remoteStreams });
    }
  }
}