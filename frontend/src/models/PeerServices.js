import Peer from "peerjs";
import io from "socket.io-client";

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
      call.answer(this.stream);
      call.on("stream", remoteStream => {
        this.addRemoteStream(id, remoteStream);
        console.log(this.remoteStreams);
      })
    })

  }

  connectNewUser(id) {
    const call = this._instance.call(id, this.stream);
    this.peers[id] = call;
    call.on("stream", remoteStream => {
      this.addRemoteStream(id, remoteStream);
      console.log(this.remoteStreams);
    });

    call.on("close", () => {
      console.log("remote user disconnected");
    })
  }

  registerStreams(callback) {
    document.addEventListener("onReceiveStreams", callback);
  }

  unRegisterStreams(callback) {
    document.removeEventListener("onReceiveStreams", callback);
  }


  dispatchEvent() {
    const event = new CustomEvent("onReceiveStreams", {
      detail: {
        streams: this.remoteStreams
      }
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
    })
  }

  leaveRoom(roomId) {
    this.socket.emit("leave-room", roomId, this.id);
  }


  addRemoteStream(userId, remoteStream) {
    const index = this.remoteStreams.findIndex(stream => stream.id === remoteStream.id);
    if (index === -1) {
      this.remoteStreams.push(remoteStream);
      this.dispatchEvent();
    }
  }
}