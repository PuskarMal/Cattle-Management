const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gfsBucket;

const initGridFS = () => {
  const conn = mongoose.connection;

  conn.once("open", () => {
    gfsBucket = new GridFSBucket(conn.db, {
      bucketName: "cattle_images"
    });
    console.log("GridFS initialized");
  });
};

const getGridFSBucket = () => gfsBucket;

module.exports = {
  initGridFS,
  getGridFSBucket
};
