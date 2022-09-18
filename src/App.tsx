export default function App() {
  return (
    <div>
      <h1 className="underline decoration-[#486581] decoration-[3px] underline-offset-[6px] text-[220%] font-semibold text-white text-center">
        Screen Recorder
      </h1>
      <div className="text-center">
        <video
          autoPlay={true}
          controls={false}
          className="hidden"
          id="videoFeedback"
          src=""
        />
        <video controls={true} className="hidden" id="videoResult" src="" />
      </div>
      <div className="text-center">
        <button
          id="downloadBtn"
          className="bg-[#658148] hover:bg-[#485c33] focus:bg-[#485c33]"
          onClick={() => console.log("dl btn clicked")}
        >
          Download this video ⤵️
        </button>
        <button
          id="startBtn"
          className="bg-[#486581] hover:bg-[#33485c] focus:bg-[#33485c]"
          onClick={() => console.log("start rec btn clicked")}
        >
          Start recording 🔴
        </button>
        <button
          id="stopBtn"
          className="hidden bg-[#5c3348] hover:bg-[#5c3348] focus:bg-[#5c3348]"
          onClick={() => console.log("stop rec btn clicked")}
        >
          Stop recording ⬜
        </button>
      </div>
    </div>
  );
}
