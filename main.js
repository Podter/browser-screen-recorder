import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import "./style.css";

const ffmpeg = createFFmpeg({ log: true });
// eslint-disable-next-line
if (!crossOriginIsolated) SharedArrayBuffer = ArrayBuffer;

const videoFeedback = document.getElementById("videoFeedback");
const videoResult = document.getElementById("videoResult");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const downloadBtn = document.getElementById("downloadBtn");
const log = document.getElementById("log");

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

async function onStop() {
  log.innerHTML = "";
  downloadBtn.style.display = "unset";
  videoFeedback.style.display = "none";
  downloadBtn.innerHTML = "Processing video 🔄";
  stopBtn.style.display = "none";
  completeBlob = new Blob(chunks, {
    type: chunks[0].type,
  });
  if (!ffmpeg.isLoaded()) await ffmpeg.load();
  ffmpeg.setLogger(({ type, message }) => {
    if (type !== "info") log.innerHTML = message;
  });
  ffmpeg.FS("writeFile", "video", await fetchFile(completeBlob));
  const fileName = `recorded-video_${getDateTime()}.mp4`;
  await ffmpeg.run("-i", "video", fileName);
  const videoFile = ffmpeg.FS("readFile", fileName);
  const videoUrl = URL.createObjectURL(
    new Blob([videoFile.buffer], { type: "video/mp4" })
  );
  startBtn.style.display = "unset";
  videoResult.style.display = "block";
  videoResult.src = videoUrl;
  downloadBtn.innerHTML = "Download this video ⤵️";
  downloadBtn.onclick = () => download(videoUrl, fileName);
  log.innerHTML = "";
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

function download(url, name) {
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  a.remove();
}
