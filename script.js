let videoPlayer = document.querySelector("video");
let recordBtn = document.querySelector("#record");
let mediaRecorder;
let chunks = [];
let isRecording = false;

recordBtn.addEventListener("click", () => {
  if (isRecording) {
    //    recording ko stop krna hai
    mediaRecorder.stop();
    isRecording = false;
  } else {
    //    recording ko on krna hai
    mediaRecorder.start();
    isRecording = true;
  }
});
// Ye ek browser ke function hai jiski help se ham user se access krva
// sakte hai uske media ko like camera and mike vgera
let promiseToUseCamera = navigator.mediaDevices.getUserMedia({
  //    by defaul all are false
  video: true,
  audio: true,
});

promiseToUseCamera
  .then((mediaStream) => {
    // simple terms me mediaStream ek object hai jisme continuosly camera and mike
    // chlta rhega jisko hm badme video player ke source me lgadete hai taki vo camera chlta rhe
    videoPlayer.srcObject = mediaStream;
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable", (e) => {
      chunks.push(e.data);
    });
    mediaRecorder.addEventListener("stop", (e) => {
      let blob = new Blob(chunks, { type: "video/mp4" });
      chunks = [];

      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4";
      a.click();
    });
  })
  .catch(() => {
    console.log("User denied the access");
  });
