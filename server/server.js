import express from "express";
import cors from "cors";
import { Server, Socket } from "socket.io";
import mongoose from "mongoose";
import DocModel from "./docSchema.js";

const val = await mongoose.connect(
  "mongodb+srv://Param:param007@cluster0.xmuxayw.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const app = express();
app.use(cors());

const serverport = app.listen(3001, () => {
  console.log("this is listieing");
});

const io = new Server(serverport, {
  cors: {
    origin: "http://localhost:3000/",
  },
});

io.on("connection", (Socket) => {
  console.log(Socket.id);

  Socket.on("getdoc", async (docId) => {
    console.log("the DOCID is ", docId);

    const data = await findorCreateDoc(docId);
    console.log("the new data is ::", data);

    Socket.join(docId, () => {
      console.log("user join the room", docId);
    });
    Socket.emit("loaddoc", data.data);

    Socket.on("changesdelta", (delta) => {
      Socket.broadcast.to(docId).emit("changesrecived", delta);
    });

    Socket.on("savedoc", async (data) => {
      const vale = await DocModel.findByIdAndUpdate(docId, { data });
      console.log("updated the value in db ");
    });
  });
});

const findorCreateDoc = async (id) => {
  if (!id) return;
  const doc = await DocModel.findById(id);
  console.log("value of doc", doc);
  if (doc) return doc;
  return await DocModel.create({ _id: id, data: "" });
};
