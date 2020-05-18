import React from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import HomeIcon from "@material-ui/icons/Home";
import CameraAltIcon from "@material-ui/icons/CameraAlt";
// import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import Router from "next/router";
import { uploadImage } from "../utils/firebaseUtil";

export default function Detect() {
  const inputEl = React.useRef<HTMLInputElement>(null);
  const imgEl = React.useRef<HTMLImageElement>(null);
  const detextedTextEl = React.useRef<HTMLDivElement>(null);
  const goodButtonEl = React.useRef<HTMLButtonElement>(null);
  const badButtonEl = React.useRef<HTMLButtonElement>(null);
  const menuButtonEl = React.useRef<HTMLButtonElement>(null);
  const homeButtonEl = React.useRef<HTMLButtonElement>(null);
  const uploadButtonEl = React.useRef<HTMLButtonElement>(null);
  const modalEl = React.useRef<HTMLDivElement>(null);
  const homeAndCameraButtonsEl = React.useRef<HTMLDivElement>(null);
  const [result, setResult] = React.useState<
    { className: string; probability: number }[]
  >([{ className: "", probability: 0 }]);
  const [message, setMessage] = React.useState<{
    messageContent: string;
    predictNumber: any;
  }>({ messageContent: "", predictNumber: 0 });
  const [detectedName, setDetectedName] = React.useState<string>("");
  const [imgFile, setImgFile] = React.useState<string>("");

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

    setDetectedName(result[message.predictNumber].className.split(",")[0]);

    detextedTextEl.current?.classList.add("detectedNameAnimRunning");

    goodButtonEl.current?.classList.remove("show");
    goodButtonEl.current?.classList.add("hidden");

    badButtonEl.current?.classList.remove("show");
    badButtonEl.current?.classList.add("hidden");

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
  };

  const clickUploadButton = async () => {
    await uploadImage(imgFile, detectedName, result);
  };

  const loadFile = async (event: any) => {
    homeAndCameraButtonsEl.current?.classList.add("hidden");

    typingMessage("Now loading...", null);

    if (imgEl.current) {
      imgEl.current.src = URL.createObjectURL(event.target.files[0]);
      setImgFile(event.target.files[0]);
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

    goodButtonEl.current?.classList.remove("hidden");
    goodButtonEl.current?.classList.add("show");
    badButtonEl.current?.classList.remove("hidden");
    badButtonEl.current?.classList.add("show");
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

      <div className="homeAndCameraButtons" ref={homeAndCameraButtonsEl}>
        <button
          className="homeIconButton"
          onClick={() =>
            Router.push({
              pathname: "/",
            })
          }
        >
          <HomeIcon fontSize="large" className="homeIcon" />
        </button>
        <button className="cameraIconButton" onClick={clickFileInput}>
          <CameraAltIcon fontSize="large" className="homeIcon" />
        </button>
      </div>

      <div className="modal hidden" ref={modalEl}>
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
      </div>

      <button
        className="goodButton hidden"
        ref={goodButtonEl}
        onClick={clickGoodButton}
      >
        <ThumbUpIcon fontSize="large" />
      </button>

      <button
        className="badButton hidden"
        ref={badButtonEl}
        onClick={clickBadButton}
      >
        <ThumbDownIcon fontSize="large" />
      </button>

      <button
        className="menuButton hidden "
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
            top: 5px;

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

          .homeAndCameraButtons {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          .homeIconButton {
            padding: 15px 15px;
            margin: 10px 10px;
            color: white;

            background: linear-gradient(
              180deg,
              #0061f2 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );

            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;
          }

          .homeIconButton:active {
            transform: translate(0, 2px);
          }

          .cameraIconButton {
            padding: 15px 15px;
            margin: 10px 10px;
            color: white;

            background: linear-gradient(
              180deg,
              #101010 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;
          }

          .cameraIconButton:active {
            transform: translate(0, 2px);
          }

          .imageDiv {
            position: absolute;
            top: 74px;
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
            min-width: 100%;
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
            display: block;
            animation: opacity1 0.3s forwards;
            animation-play-state: running;
          }

          .hidden {
            display: none;
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
            width: 500px;
            height: 270px;
            top: 50%;
            left: 50%;
            border: 1px solid #c1c1c1;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            transform: translate(-50%, -50%);
            background: white;
            color: black;

            opacity: 0;
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

            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

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

            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            letter-spacing: 0.1em;
            color: #ffffff;
            cursor: pointer;
            outline: none;
          }

          .goodButton {
            position: absolute;
            padding: 15px 15px;
            right: 20px;
            bottom: 20px;

            color: white;

            background: linear-gradient(180deg, #34cc62 29.33%, #add210 100%);
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;

            animation: opacity1 1s forwards;
          }

          .badButton {
            position: absolute;
            padding: 15px 15px;
            left: 20px;
            bottom: 20px;

            color: white;

            background: linear-gradient(180deg, #cc3434 29.33%, #ff279d 100%);
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;

            animation: opacity1 1s forwards;
          }

          .goodButton:active,
          .badButton:active {
            transform: translateY(2px);
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

            color: white;

            background: linear-gradient(180deg, #f56767 29.33%, #ff004d 100%);

            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;
          }

          @keyframes opacity1 {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
}
