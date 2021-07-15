export const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.play();
}

export const streamVideo = (video, stream) => {
  video.srcObject = stream;
  video.play();
}