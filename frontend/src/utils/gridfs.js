import mongoose from "mongoose";
import Grid from "gridfs-stream";

let gfs;

mongoose.connection.once("open", () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("cattle_images");
});

export { gfs };
