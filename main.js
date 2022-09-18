import "./style.css";

const videoFeedback = document.getElementById("videoFeedback");
const videoResult = document.getElementById("videoResult");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");

startBtn.onclick = startRecord;
stopBtn.onclick = stopScreen;

let completeBlob = null;
let recorder = null;
let stream = null;
let audio = null;
let mixedStream = null;
let chunks = [];

function setVideoFeedback() {
  if (stream) {
    videoFeedback.srcObject = stream;
    videoFeedback.play();
  }
}

async function startRecord() {
  console.log(1);
  stream = await navigator.mediaDevices.getDisplayMedia({
    video: {
      mediaSource: "screen",
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  });
  console.log(stream);
  audio = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      sampleRate: 44100,
    },
  });

  console.log(3);
  mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
  recorder = new MediaRecorder(mixedStream);
  recorder.ondataavailable = (e) => chunks.push(e.data);
  videoResult.style.display = "none";
  recorder.start();
  setVideoFeedback();
  recorder.onstop = onStop;
  videoFeedback.style.display = "unset";
  startBtn.style.display = "none";
  stopBtn.style.display = "unset";
}

async function stopScreen() {
  recorder.stop();
  stream.getTracks().forEach(function (track) {
    track.stop();
  });
  audio.getTracks().forEach(function (track) {
    track.stop();
  });
}

function onStop() {
  stopBtn.style.display = "none";
  startBtn.style.display = "unset";
  videoFeedback.style.display = "none";
  completeBlob = new Blob(chunks, {
    type: chunks[0].type,
  });
  videoResult;
  videoResult.style.display = "block";
  const videoUrl = URL.createObjectURL(completeBlob);
  videoResult.src = videoUrl;
  downloadBtn.style.display = "unset";
  downloadBtn.download = "recorded-video_" + getDateTime();
}

function getDateTime() {
  let date = new Date();
  let hour = date.getHours();
  hour = (hour < 10 ? "0" : "") + hour;
  let min = date.getMinutes();
  min = (min < 10 ? "0" : "") + min;
  let sec = date.getSeconds();
  sec = (sec < 10 ? "0" : "") + sec;
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  month = (month < 10 ? "0" : "") + month;
  let day = date.getDate();
  day = (day < 10 ? "0" : "") + day;
  return day + "-" + month + "-" + year + "-" + hour + "-" + min + "-" + sec;
}
