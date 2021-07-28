
let videoPlayer = document.querySelector("video");
let captureBtn=document.querySelector("#capture");
let recordBtn = document.querySelector("#record");
let body=document.querySelector("body");
let mediaRecorder;
let chunks = [];
let isRecording = false;
let filter=""

let allFilters=document.querySelectorAll(".filter");

for(let i=0;i<allFilters.length;i++)
{
    allFilters[i].addEventListener("click",(e)=>{

    let previousFilter=document.querySelector(".filter-div");
    if(previousFilter) previousFilter.remove();

    let color=e.currentTarget.style.backgroundColor;
    let div=document.createElement("div");
    div.classList.add("filter-div");
    div.style.backgroundColor=color;
    body.append(div);
    filter=color;
  })
}
captureBtn.addEventListener("click",()=>{
   let innerSpan=captureBtn.querySelector("span");
   innerSpan.classList.add("capture-animation")

    setTimeout(()=>{
      innerSpan.classList.remove("capture-animation");
    },1000);

    let canvas=document.createElement("canvas");
    canvas.width=videoPlayer.videoWidth;
    canvas.height=videoPlayer.videoHeight;

    let tool=canvas.getContext("2d");

    tool.drawImage(videoPlayer,0,0);
    
    if(filter!=""){
      tool.fillStyle=filter;
      // by default rectangle ka color black hota hai to hmne isse fillstyle 
      // diya color 
      tool.fillRect(0,0,canvas.width,canvas.height);
    }
    let url=canvas.toDataURL(canvas);
    let a = document.createElement("a");
    a.href = url;
    a.download = "image.png";
    a.click();
    a.remove();
    // body.append(canvas);

});

recordBtn.addEventListener("click", () => {
  let innerSpan=recordBtn.querySelector("span");

  let previousFilter=document.querySelector(".filter-div");
  if(previousFilter) previousFilter.remove();
  filter="";

  if (isRecording) {
    //    recording ko stop krna hai
    mediaRecorder.stop();
    isRecording = false;
    innerSpan.classList.remove("record-animation");
  } else {
    //    recording ko on krna hai
    mediaRecorder.start();
    isRecording = true;
    innerSpan.classList.add("record-animation");
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
      a.remove();
    });
  })
  .catch(() => {
    console.log("User denied the access");
  });
