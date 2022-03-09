let completeBlob = null
let recorder = null
let stream = null
let chunks = [];

function videoFeedback() {
    if (stream) {
        const video = document.getElementById("videoFeedback");
        video.srcObject = stream;
		video.play();
    }
}

async function startRecord() {
    stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
            mediaSource: "screen",
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
        }
    });
    audio = await navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100,
        },
    });
    mixedStream = new MediaStream([...stream.getTracks(), ...audio.getTracks()]);
    recorder = new MediaRecorder(mixedStream);
    recorder.ondataavailable = (e) => chunks.push(e.data);
    document.getElementById("videoResult").style.display = "none";
    recorder.start();
    videoFeedback();
    recorder.onstop = onStop;
    document.getElementById("videoFeedback").style.display = "unset";
    document.getElementById("startBtn").style.display = "none";
    document.getElementById("stopBtn").style.display = "unset";
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
    document.getElementById("stopBtn").style.display = "none";
    document.getElementById("startBtn").style.display = "unset";
    document.getElementById("videoFeedback").style.display = "none";
    completeBlob = new Blob(chunks, {
        type: chunks[0].type
    });
    let downloadButton = document.getElementById("downloadBtn");
    let video = document.getElementById("videoResult");
    video.style.display = "block";
    video.src = URL.createObjectURL(completeBlob);
    downloadButton.style.display = "unset";
    downloadButton.href = URL.createObjectURL(completeBlob);
    downloadButton.download = "recorded-video_" + getDateTime();
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
