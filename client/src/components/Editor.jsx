import React, { useCallback, useEffect, useRef, useState } from "react";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "../components/style.css";

import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

export const Editor = () => {
  const [quill, setquill] = useState();
  const [sockett, setsocket] = useState();

  let { id } = useParams();

  //setting up the editor
  const wrapperRef = useCallback((wrapper) => {
    const Editor = document.createElement("div");
    wrapper.append(Editor);
    const q = new Quill("#container", { theme: "snow" });
    q.disable();
    q.setText("loading...");
    setquill(q);
    return () => {
      wrapper.innerHTML = " ";
    };
  }, []);

  // adding the changes
  useEffect(() => {
    quill?.on("text-change", (delta, oldDelta, source) => {
      if (source !== "user") return;
      console.log(source);
      sockett?.emit("changesdelta", delta);
    });
      
  }, [sockett, quill]);

  // receiving the changes and updating them
  useEffect(() => {
    sockett?.on("changesrecived", (delta) => {
      console.log("recive chaneges", delta);
      quill.updateContents(delta);
    });
  }, [sockett, quill]);

  // settting up the socket
  useEffect(() => {
    const s = io("http://localhost:3001");
    setsocket(s);
    s.emit("connection");

    return () => {
      s.disconnect();
    };
  }, []);

  //loading the doc data and adding it to room
  useEffect(() => {
    console.log(id);
    sockett?.once("loaddoc", (id) => {
      console.log("data: ", id, "dd");
      quill?.setContents(id);
      quill?.enable();
    });

      sockett?.emit("getdoc", id);
      return () => {
          
      }
  }, [id,sockett, quill]);

  //updating the doc
  useEffect(() => {
    const interval = setInterval(() => {
      sockett?.emit("savedoc", quill.getContents());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [sockett, quill]);

  return <div id="container" ref={wrapperRef}></div>;
};
