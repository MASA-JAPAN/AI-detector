import React from "react";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";

export default function Detect() {
  const inputEl = React.useRef<HTMLInputElement>(null);
  const imgEl = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    clickFileInput();
  }, []);

  const clickFileInput = () => {
    if (inputEl.current) {
      inputEl.current.click();
    }
  };

  const loadFile = (event: any) => {
    if (imgEl.current) {
      console.log(event.target.files[0]);

      imgEl.current.src = URL.createObjectURL(event.target.files[0]);
    }
  };

  //filter: drop-shadow(2px 4px 6px black);

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
        <div className="message">Is this xxxx?</div>
      </div>

      <div className="imageDiv">
        <img ref={imgEl} className="image" />
      </div>

      <button className="goodButton">
        <ThumbUpIcon fontSize="large" />
      </button>

      <button className="badButton">
        <ThumbDownIcon fontSize="large" />
      </button>

      <style jsx>
        {`
          .fileInput {
            display: none;
          }
          .board {
            position: fixed;
            width: 98vw;
            height: 58px;
            left: calc(50% - 98vw / 2);
            top: 1vw;

            background: #ffffff;
            border: 1px solid #949494;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
            border-radius: 10px;
          }
          .message {
            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 35px;

            align-items: center;
            text-align: center;
            margin: auto;

            color: #000000;
          }

          .imageDiv {
            text-align: center;
            position: relative;
            top: calc(58px + 4vw);
          }

          .image {
            max-width: 96vw;
            filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
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
          }
        `}
      </style>
    </div>
  );
}
