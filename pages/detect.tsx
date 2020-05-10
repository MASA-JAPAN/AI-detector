import React from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
// import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

import Router from "next/router";

export default function Detect() {
  const inputEl = React.useRef<HTMLInputElement>(null);
  const imgEl = React.useRef<HTMLImageElement>(null);
  const detextedTextEl = React.useRef<HTMLDivElement>(null);
  const goodButtonEl = React.useRef<HTMLButtonElement>(null);
  const badButtonEl = React.useRef<HTMLButtonElement>(null);
  const menuButtonEl = React.useRef<HTMLButtonElement>(null);
  const homeButtonEl = React.useRef<HTMLButtonElement>(null);
  // const confirmationEl = React.useRef<HTMLDivElement>(null);
  const uploadButtonEl = React.useRef<HTMLButtonElement>(null);
  const modalEl = React.useRef<HTMLDivElement>(null);
  const [result, setResult] = React.useState<
    { className: string; probability: number }[]
  >([{ className: "", probability: 0 }]);
  const [message, setMessage] = React.useState<{
    messageContent: string;
    predictNumber: any;
  }>({ messageContent: "", predictNumber: 0 });
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [detectedName, setDetectedName] = React.useState<string>("");

  React.useEffect(() => {
    const init = async () => {
      await typingMessage("Please take a picture.", null);
      clickFileInput();
    };

    init();
  }, []);

  const clickFileInput = () => {
    if (inputEl.current) {
      inputEl.current.click();
    }
  };

  const clickGoodButton = () => {
    typingMessage(
      "Great! This is " +
        result[message.predictNumber].className.split(",")[0] +
        ".",
      message.predictNumber
    );

    console.log(detextedTextEl.current?.style);
    setDetectedName(result[message.predictNumber].className.split(",")[0]);

    detextedTextEl.current?.classList.toggle("detectedNameAnimRunning");
    goodButtonEl.current?.classList.toggle("buttonHidden");
    badButtonEl.current?.classList.toggle("buttonHidden");

    menuButtonEl.current?.classList.remove("hidden");
    menuButtonEl.current?.classList.add("show");
  };

  const clickBadButton = () => {
    message.predictNumber++;
    if (message.predictNumber <= 2) {
      typingMessage(
        "Is this " +
          result[message.predictNumber].className.split(",")[0] +
          " ?",
        message.predictNumber
      );
    } else {
      typingMessage("Sorry, I don't know...", null);
    }
  };

  const clickMenuButton = () => {
    modalEl.current?.classList.remove("hidden");
    modalEl.current?.classList.add("show");
    menuButtonEl.current?.classList.remove("show");
    menuButtonEl.current?.classList.add("hidden");
  };

  const clickCloseButton = () => {
    modalEl.current?.classList.remove("show");

    modalEl.current?.classList.add("hidden");
    menuButtonEl.current?.classList.remove("hidden");
    menuButtonEl.current?.classList.add("show");

    // uploadButtonEl.current?.classList.remove("uploadButtonAfterClick");
  };

  const clickUploadButton = () => {
    // homeButtonEl.current?.classList.add("hidden");
    // confirmationEl.current?.classList.add("show");
    // modalEl.current?.classList.add("modalLarge");
    // uploadButtonEl.current?.classList.add("uploadButtonAfterClick");
  };

  const loadFile = async (event: any) => {
    typingMessage("Now loading...", null);

    if (imgEl.current) {
      imgEl.current.src = URL.createObjectURL(event.target.files[0]);
    }

    const net = await mobilenet.load();

    if (net && imgEl.current) {
      const tmpResult = await net.classify(imgEl.current);
      setResult(tmpResult);

      typingMessage(
        "Is this " + tmpResult[0].className.split(",")[0] + " ?",
        0
      );
    }

    setLoaded(true);
  };

  const typingMessage = async (messageText: string, tmpPredictNumber: any) => {
    for (let i = 1; i <= messageText.length; i++) {
      await delay(50);

      setMessage({
        messageContent: messageText.substr(0, i),
        predictNumber: tmpPredictNumber,
      });
    }
  };

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <div>
      <input
        ref={inputEl}
        type="file"
        className="fileInput"
        accept="image/*"
        onChange={(event) => loadFile(event)}
      />

      <div className="board">
        <div className="message">{message.messageContent}</div>
      </div>

      <div className="imageDiv">
        <img ref={imgEl} className="image" />
        <div ref={detextedTextEl} className="detectedName">
          {detectedName}
        </div>
      </div>

      <div className="modal" ref={modalEl}>
        <button
          className="homeButton"
          onClick={() =>
            Router.push({
              pathname: "/",
            })
          }
          ref={homeButtonEl}
        >
          Home
        </button>

        <button
          className="uploadButton"
          ref={uploadButtonEl}
          onClick={clickUploadButton}
        >
          Upload
        </button>
        <button className="closeButton" onClick={clickCloseButton}>
          <CloseIcon fontSize="large"></CloseIcon>
        </button>

        {/* <div className="textContent" ref={confirmationEl}>
          <div className="confirmationTitle">Please confirm</div>
          <div className="confirmationContent">
            <p>This photo will be public and uploaded to Gallery.</p>
            <p>If you would like to delete it, it is necessary to apply us.</p>
          </div>
          <div className="confirmationCheck">
            I confirmed! <input type="checkbox" />
          </div>
        </div> */}
      </div>

      {loaded && (
        <div>
          <button
            className="goodButton"
            ref={goodButtonEl}
            onClick={clickGoodButton}
          >
            <ThumbUpIcon fontSize="large" />
          </button>

          <button
            className="badButton"
            ref={badButtonEl}
            onClick={clickBadButton}
          >
            <ThumbDownIcon fontSize="large" />
          </button>
        </div>
      )}

      <button
        className="menuButton"
        ref={menuButtonEl}
        onClick={clickMenuButton}
      >
        <MenuIcon fontSize="large" />
      </button>

      <style jsx>
        {`
          .fileInput {
            display: none;
          }
          .board {
            position: absolute;
            width: 98vw;
            height: 64px;
            left: calc(50% - 98vw / 2);
            top: 1vw;

            background: #ffffff;
            border: 1px solid #949494;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
          }
          .message {
            position: absolute;
            width: 100%;

            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            font-family: "Press Start 2P", cursive;
            font-style: normal;
            font-weight: 500;
            font-size: 25px;

            text-align: center;
            vertical-align: middle;

            color: #000000;
          }

          .imageDiv {
            position: absolute;
            top: 9%;
            left: 50%;
            transform: translate(-50%, 0);

            width: 96%;
            height: 89%;

            overflow: hidden;
          }

          .image {
            position: absolute;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
            max-width: 100%;
          }

          .detectedName {
            position: absolute;
            width: fit-content;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 100px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0px 15px;
            opacity: 1;
          }

          .detectedNameAnimRunning {
            animation: detectedNameAnim 2s forwards;
            animation-play-state: running;
          }

          .show {
            animation: opacity1 0.5s forwards;
            animation-play-state: running;
          }

          .hidden {
            animation: opacity0 0.5s forwards;
            animation-play-state: running;
          }

          @keyframes detectedNameAnim {
            0% {
              opacity: 0;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 100px;
            }
            50% {
              opacity: 1;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 100px;
            }
            100% {
              top: 0;
              left: 0;
              transform: translate(0, 0);
              font-size: 50px;
            }
          }

          .modal {
            position: absolute;
            width: 50vh;
            height: 45vw;
            top: 50%;
            left: 50%;
            border: 1px solid #c1c1c1;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            transform: translate(-50%, -50%);
            background: white;
            color: black;

            opacity: 0;
          }

          .modalLarge {
            animation: modalLargeAnim 1s forwards;
          }

          @keyframes modalLargeAnim {
            0% {
            }
            100% {
              height: 60vw;
              opacity: 1;
            }
          }

          .textContent {
            opacity: 0;
          }

          .confirmationTitle {
            position: absolute;
            left: 50%;
            transform: translate(-50%, 0);

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            letter-spacing: 0.1em;
          }

          .confirmationContent {
            position: absolute;
            top: 13%;
            font-size: 19px;
            padding: 0 15px;
          }

          .confirmationCheck {
            position: absolute;
            top: 55%;
            left: 50%;
            transform: translate(-50%, 0);
            font-size: 24px;
          }

          .homeButton {
            position: absolute;
            width: 300px;
            height: 50px;
            top: 25%;
            left: 50%;
            transform: translate(-50%, 0);

            background: linear-gradient(
              180deg,
              #0061f2 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );
            border: 1px solid #1a6eec;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 13px;

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            letter-spacing: 0.1em;
            color: #ffffff;
            cursor: pointer;
            outline: none;
          }

          .uploadButton {
            position: absolute;
            width: 300px;
            height: 50px;
            top: 55%;
            left: 50%;
            transform: translate(-50%, 0);

            background: linear-gradient(
              180deg,
              #101010 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );
            border: 1px solid #333333;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 13px;

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            letter-spacing: 0.1em;
            color: #ffffff;
            cursor: pointer;
            outline: none;
          }

          .uploadButtonAfterClick {
            animation: uploadButtonAfterClickaAnim 1s forwards;
          }

          @keyframes uploadButtonAfterClickaAnim {
            0% {
            }
            100% {
              top: 76%;
            }
          }

          .goodButton {
            position: absolute;
            padding: 25px 25px;
            right: 20px;
            bottom: 20px;

            background: linear-gradient(180deg, #a6f567 29.33%, #dbff00 100%);
            border: 1px solid #cecece;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            border-radius: 48px;

            text-align: center;
            outline: none;
            cursor: pointer;

            animation: opacity1 1s;
          }

          .badButton {
            position: absolute;
            padding: 25px 25px;
            left: 20px;
            bottom: 20px;

            background: linear-gradient(180deg, #f56767 29.33%, #ff004d 100%);
            border: 1px solid #cecece;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            border-radius: 48px;

            text-align: center;
            outline: none;
            cursor: pointer;

            animation: opacity1 1s;
          }

          .menuButton {
            position: absolute;
            padding: 25px 25px;
            left: 50%;
            bottom: 20px;
            transform: translate(-50%, 0);

            background: linear-gradient(180deg, #f8f8f8 29.33%, #ffffff 100%);
            border: 1px solid #cecece;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            border-radius: 48px;

            text-align: center;
            outline: none;
            cursor: pointer;

            opacity: 0;
          }

          .closeButton {
            position: absolute;
            padding: 7px 8px;
            top: 0;
            right: 0;
            transform: translate(15px, -20px);

            background: linear-gradient(180deg, #f56767 29.33%, #ff004d 100%);
            border: 1px solid #cecece;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            border-radius: 48px;

            text-align: center;
            outline: none;
            cursor: pointer;
          }

          .buttonHidden {
            animation: opacity0 1s forwards;
            animation-play-state: running;
          }

          @keyframes opacity1 {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          @keyframes opacity0 {
            0% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
