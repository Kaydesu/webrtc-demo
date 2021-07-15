import axios from "axios";

export const ApiService = {
  createUser: async (userId) => {
    const res = await axios.get(`/api/users/create/${userId}`);
    return res.data;
  },
  createRoom: async () => {
    const res = await axios.get(`/api/room/create`);
    return res.data;
  },
  getRooms: async () => {
    const res = await axios.get(`/api/room`);
    return res.data;
  },
  requestJoinRoom: async (roomId, userId) => {
    const res = await axios.get(`/api/room/join?userId=${userId}&roomId=${roomId}`);
    return res.data;
  }
}