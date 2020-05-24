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
  const modalConfirmationEl = React.useRef<HTMLDivElement>(null);
  const checkEl = React.useRef<HTMLInputElement>(null);
  const homeAndCameraButtonsEl = React.useRef<HTMLDivElement>(null);
  const loaderEL = React.useRef<HTMLDivElement>(null);
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
      goodButtonEl.current?.classList.remove("show");
      goodButtonEl.current?.classList.add("hidden");
      badButtonEl.current?.classList.remove("show");
      badButtonEl.current?.classList.add("hidden");

      homeAndCameraButtonsEl.current?.classList.remove("hidden");
      homeAndCameraButtonsEl.current?.classList.add("show");

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

  const clickCloseButtonModalConfirmation = () => {
    modalConfirmationEl.current?.classList.remove("show");
    modalConfirmationEl.current?.classList.add("hidden");
    menuButtonEl.current?.classList.remove("hidden");
    menuButtonEl.current?.classList.add("show");
  };

  const clickUploadButton = async () => {
    modalEl.current?.classList.remove("show");
    modalEl.current?.classList.add("hidden");
    modalConfirmationEl.current?.classList.remove("hidden");
    modalConfirmationEl.current?.classList.add("show");
  };

  const clickUploadButtonWithConfirmation = async () => {
    if (checkEl.current?.checked) {
      loaderEL.current?.classList.remove("displayNone");
      await uploadImage(imgFile, detectedName, result);
      loaderEL.current?.classList.add("displayNone");
      Router.push({
        pathname: "/gallery",
      });
    }
  };

  const checkValue = () => {
    if (checkEl.current?.checked) {
      uploadButtonEl.current?.classList.add("active");
    } else {
      uploadButtonEl.current?.classList.remove("active");
    }
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
          Move to upload
        </button>
        <button className="closeButton" onClick={clickCloseButton}>
          <CloseIcon fontSize="large"></CloseIcon>
        </button>
      </div>

      <div className="modalConfirmation hidden" ref={modalConfirmationEl}>
        <div className="confirmationTitle">Please Confirm</div>
        <div className="confirmationContainer">
          <p>This photo will be public and uploaded to Gallery.</p>
          <p>If you would like to delete it, it is necessary to apply us.</p>
        </div>
        <div className="checkContainer">
          <label>
            I confirmed!
            <input type="checkbox" ref={checkEl} onClick={checkValue} />
          </label>
        </div>

        <button
          className="uploadButton"
          ref={uploadButtonEl}
          onClick={clickUploadButtonWithConfirmation}
        >
          Upload
        </button>
        <button
          className="closeButton"
          onClick={clickCloseButtonModalConfirmation}
        >
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

      {/* loader */}
      <div className="loaderContainer displayNone" ref={loaderEL}>
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
          <div className="inner four"></div>
          <div className="inner five"></div>
          <div className="inner six"></div>
        </div>
      </div>

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

          .modal .homeButton {
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

          .modal .homeButton:active {
            transform: translate(-50%, 2px);
          }

          .modal .uploadButton {
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

          .modal .uploadButton:active {
            transform: translate(-50%, 2px);
          }

          .modalConfirmation {
            position: absolute;
            width: 500px;
            height: 350px;
            top: 50%;
            left: 50%;
            border: 1px solid #c1c1c1;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            transform: translate(-50%, -50%);
            background: white;
            color: black;

            opacity: 0;
          }

          .modalConfirmation .uploadButton {
            position: absolute;
            width: 300px;
            height: 50px;
            left: 50%;
            bottom: 40px;
            transform: translate(-50%, 0);

            background: linear-gradient(
              180deg,
              #c7c7c7 -22.45%,
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

            transition: all 1s ease-out;
          }

          .modalConfirmation .active {
            /*animation: activeAnim 0.5s forwards;*/
            background: linear-gradient(
              180deg,
              #101010 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );
          }

          @keyframes activeAnim {
            0% {
              background: linear-gradient(
                180deg,
                #c7c7c7 -22.45%,
                rgba(196, 196, 196, 0) 485.71%
              );
            }

            100% {
              background: linear-gradient(
                180deg,
                #101010 -22.45%,
                rgba(196, 196, 196, 0) 485.71%
              );
            }
          }

          .modalConfirmation .uploadButton:active {
            transform: translate(-50%, 2px);
          }

          .confirmationTitle {
            position: absolute;
            top: 35px;
            left: 50%;
            transform: translate(-50%, 0);

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 30px;

            letter-spacing: 0.1em;
          }

          .confirmationContainer {
            position: absolute;
            top: 96px;
            left: 50%;
            width: 100%;
            padding-left: 13px;

            transform: translate(-50%, 0);
          }

          .confirmationContainer p {
            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 15px;
            align-items: center;
            letter-spacing: 0.1em;
          }

          .checkContainer {
            position: absolute;
            top: 195px;
            left: 50%;
            transform: translate(-50%, 0);
            display: flex;

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 20px;
          }

           {
            /* .checkContainer p {
            margin: 0;
          }

          .checkContainer input {
            margin-left: 5px;
          } */
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

          .menuButton:active {
            transform: translate(-50%, 2px);
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

          .closeButton:active {
            transform: translate(15px, -18px);
          }

          @keyframes opacity1 {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          /* loader */

          .displayBlock {
            display: block;
          }

          .displayNone {
            display: none;
          }

          .loaderContainer {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(90, 90, 90, 0.71);
          }

          .loader {
            position: absolute;
            top: calc(50% - 50px);
            left: calc(50% - 50px);
            width: 100px;
            height: 100px;
            border-radius: 50%;
            perspective: 800px;
          }

          .inner {
            position: absolute;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }

          .inner.one {
            right: 0%;
            bottom: 0%;
            animation: rotate-one 1s linear infinite;
            border-top: 5px solid rgb(108, 162, 255);
          }

          .inner.two {
            right: 0%;
            bottom: 0%;
            animation: rotate-two 1s linear infinite;
            border-top: 5px solid rgb(108, 162, 255);
          }

          .inner.three {
            right: 0%;
            bottom: 0%;
            animation: rotate-three 1s linear infinite;
            border-top: 5px solid rgb(108, 162, 255);
          }

          .inner.four {
            left: 0%;
            top: 0%;
            animation: rotate-four 1s linear infinite;
            border-bottom: 5px solid rgb(108, 162, 255);
          }

          .inner.five {
            left: 0%;
            top: 0%;
            animation: rotate-five 1s linear infinite;
            border-bottom: 5px solid rgb(108, 162, 255);
          }

          .inner.six {
            left: 0%;
            top: 0%;
            animation: rotate-six 1s linear infinite;
            border-bottom: 5px solid rgb(108, 162, 255);
          }

          @keyframes rotate-one {
            0% {
              transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
            }
          }

          @keyframes rotate-two {
            0% {
              transform: rotateX(15deg) rotateY(55deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(15deg) rotateY(55deg) rotateZ(360deg);
            }
          }

          @keyframes rotate-three {
            0% {
              transform: rotateX(27deg) rotateY(55deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(27deg) rotateY(55deg) rotateZ(360deg);
            }
          }

          @keyframes rotate-four {
            0% {
              transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
            }
          }

          @keyframes rotate-five {
            0% {
              transform: rotateX(15deg) rotateY(-45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(15deg) rotateY(-45deg) rotateZ(360deg);
            }
          }

          @keyframes rotate-six {
            0% {
              transform: rotateX(27deg) rotateY(-45deg) rotateZ(0deg);
            }
            100% {
              transform: rotateX(27deg) rotateY(-45deg) rotateZ(360deg);
            }
          }

          @media screen and (max-width: 750px) {
            .message {
              font-size: 22px;
            }

            @keyframes detectedNameAnim {
              0% {
                opacity: 0;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 75px;
              }
              50% {
                opacity: 1;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 75px;
              }
              100% {
                top: 0;
                left: 0;
                transform: translate(0, 0);
                font-size: 35px;
              }
            }
          }

          @media screen and (max-width: 630px) {
            .message {
              font-size: 18px;
            }

            @keyframes detectedNameAnim {
              0% {
                opacity: 0;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 50px;
              }
              50% {
                opacity: 1;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 75px;
              }
              100% {
                top: 0;
                left: 0;
                transform: translate(0, 0);
                font-size: 27px;
              }
            }

            .board {
              height: 50px;
            }

            .imageDiv {
              top: 62px;
            }

            .modal {
              width: 400px;
              height: 300px;
            }
          }

          @media screen and (max-width: 500px) {
            .message {
              font-size: 14px;
            }

            @keyframes detectedNameAnim {
              0% {
                opacity: 0;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 40px;
              }
              50% {
                opacity: 1;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 40px;
              }
              100% {
                top: 0;
                left: 0;
                transform: translate(0, 0);
                font-size: 20px;
              }
            }

            .board {
              height: 50px;
            }

            .imageDiv {
              top: 62px;
            }

            .modal {
              width: 400px;
              height: 300px;
            }
          }

          @media screen and (max-width: 450px) {
            .message {
              font-size: 14px;
            }

            @keyframes detectedNameAnim {
              0% {
                opacity: 0;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 40px;
              }
              50% {
                opacity: 1;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 40px;
              }
              100% {
                top: 0;
                left: 0;
                transform: translate(0, 0);
                font-size: 20px;
              }
            }

            .board {
              height: 50px;
            }

            .imageDiv {
              top: 62px;
            }

            .modal {
              width: 300px;
              height: 300px;
            }

            .modal .homeButton {
              width: 250px;
            }

            .modalConfirmation {
              width: 300px;
              height: 300px;
            }

            .modal .uploadButton {
              width: 250px;
            }

            .modalConfirmation .uploadButton {
              width: 250px;
              bottom: 30px;
            }

            .confirmationTitle {
              font-size: 17px;
            }

            .confirmationContainer {
              top: 78px;
            }

            .confirmationContainer p {
              font-size: 11px;
            }

            .checkContainer {
              top: 180px;
              font-size: 15px;
            }
          }
        `}
      </style>
    </div>
  );
}
