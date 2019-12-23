let express = require("express");
let vision = require("./depenedencies");
let multer = require("multer");
let bodyParser = require("body-parser");
let fs = require("fs");

let app = express();

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 1000000
  })
);
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);

// SET STORAGE
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "files");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

var upload = multer({
  storage: storage
});

let router = express.Router();
router.post("/file", upload.any(), async (req, res) => {
  try {
    console.log("OCR file start", req.files);
    let { flag = false } = req.query;
    const file = req.files && req.files.length != 0 ? req.files[0] : "";
    // console.log(file);
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      throw error;
    }
    let d = await quickstart(file.path, flag);

    res.status(200).send(d);
  } catch (error) {
    console.log("error", error);
    res.status(500).send({
      error: {
        msg: error.message
      }
    });
  }
});

app.use("/img", router);

// main function

async function quickstart(path, flag) {
  console.log("path & flag", path, flag);
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  // Performs label detection on the image file
  const [result] = await client.textDetection(path);
  const detections = result.textAnnotations;
  console.log("detections", detections);

  return "done";
}

// server configuarations
app.listen(6200, () => {
  console.log("Server running on port 6200");
});
