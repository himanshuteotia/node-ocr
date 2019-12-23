let OCR_DATA_JSON = require("./result");
let vision = require("./depenedencies");
var express = require("express");
const app = express();

str1 = "Hello CIMB_CARD 456****765 k **** lkoo *** KLL";
let removeAllStars = str1.replace(/\B\*/gm, "");

/*


  Regular expression to remove all stars from string

 //



*/

NOT_FOUND = "NOT_FOUND";

function getDateOfPurchase(text) {
  let dateIndex = text.search("www.lottemart.co");
  //   console.log("dateIndex", dateIndex);
  var pattern = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gi;
  let str = text.substring(dateIndex + 10, dateIndex + 100);
  //   console.log(str);
  let date = str.match(pattern);
  //   console.log(date[0]);
  return date && date[0] ? date[0] : NOT_FOUND;
}

function getCardNumber(text) {
  let cardIndex = text.search("Sale Amt");
  text = text.replace("\n", " ");
  // console.log(text.split(" "))
  let cardNo = text
    .substring(cardIndex + 10, cardIndex + 26)
    .replace(/[^a-zA-Z0-9]/g, "*");
  return cardNo ? cardNo : NOT_FOUND;
}

async function quickstart(path, flag) {
  try {
    // Creates a client
    const client = new vision.ImageAnnotatorClient();

    // Performs label detection on the image file
    const [result] = await client.textDetection(path);
    const detections = result.textAnnotations;
    // console.log('Text:',detections);
    // detections.forEach(text => console.log(text.description));
    dataPostProcessing(detections);
    getTotalSum(detections);
    console.log(receiptDetails);
    if (flag)
      receiptDetails.text = detections[0].description.replace(/\n|\r/g, " ");
    // if(!receiptDetails.card_number) getCardNumber(detections[0].description)
    receiptDetails.store_name = trimName(receiptDetails.store_name);
    prcessingOnWholeDescription(
      detections[0].description.replace(/\n|\r/g, " ")
    );
    generateCSVFile(receiptDetails, path);
    setNameOfStore(detections[0].description.replace(/\n|\r/g, " "));
    return receiptDetails;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

var bodyParser = require("body-parser");
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
const multer = require("multer");

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
String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

function createNewObject() {
  let receiptDetails = {
    store_name: "",
    date: "",
    items: [],
    total_sum: 0,
    card_number: "",
    discount: 0
  };
  return receiptDetails;
}

function trimName(name) {
  return name.trim();
}

function setNameOfStore(text) {
  if (text.search("BINTARO") != -1) {
    receiptDetails.store_name = "LOTTEMART BINTARO";
  }
  if (text.search("KUNINGAN") != -1) {
    receiptDetails.store_name = "LOTTEMART KUNINGAN CITY";
  }
  if (text.search("FATMAWATI") != -1) {
    receiptDetails.store_name = "LOTTEMART FATMAWATI";
  }
  if (text.search("GANDARIA") != -1) {
    receiptDetails.store_name = "LOTTEMART GANDARIA CITY";
  }
  if (text.search("KELAPA") != -1) {
    receiptDetails.store_name = "LOTTEMART KELAPA GADING";
  }
  if (text.search("PAKUWON") != -1) {
    receiptDetails.store_name = "LOTTEMART PAKUWON";
  }
  if (text.search("TAMAN") != -1) {
    receiptDetails.store_name = "LOTTEMART TAMAN SURYA";
  }
  if (text.search("RATU") != -1) {
    receiptDetails.store_name = "LOTTEMART RATU PLAZA";
  }
  if (text.search("MARVELL") != -1 || text.search("MARVEL") != -1) {
    receiptDetails.store_name = "LOTTEMART MARVELL CITY";
  }
  if (text.search("BANDUNG") != -1) {
    receiptDetails.store_name = "LOTTE MART BANDUNG FESTIVAL CITY";
  }
}

let receiptDetails = {
  store_name: "",
  date: "",
  items: [],
  total_sum: 0,
  card_number: "",
  discount: 0
};

let listNumbers = [
  "001",
  "002",
  "003",
  "004",
  "005",
  "006",
  "007",
  "008",
  "009",
  "010",
  "011",
  "012",
  "013",
  "014",
  "015",
  "016",
  "017",
  "018",
  "019",
  "020",
  "021",
  "022",
  "023",
  "024",
  "025",
  "026",
  "027",
  "028",
  "029",
  "030"
];

let fs = require("fs");
function generateCSVFile(data, pathOfFile) {
  // console.log('data',data);
  const output = [];
  let row = [];
  row.push([
    "Vendor name",
    "Date",
    "Product Name",
    "Product Code",
    "Quantity",
    "Unit Price",
    "Final Price",
    "S Code",
    "Other"
  ]);
  output.push(row.join());
  let totalAmount = 0;

  for (var k = 0; k < data.items.length; k++) {
    row = [];
    row.push([
      k == 0 ? data.store_name : "",
      k == 0 ? data.date : "",
      data.items[k].name,
      data.items[k].product_code,
      data.items[k].quantity,
      data.items[k].unit_price,
      data.items[k].final_price,
      data.items[k].s_code,
      data.items[k].other,
      "",
      ""
    ]);
    output.push(row.join());
  }
  output.push(["", ""]);
  output.push(["", ""]);
  output.push(["Card Number", data.card_number]);
  output.push(["Total Amount", data.total_sum]);
  output.push(["Discount", data.discount]);
  output.push(["Suggested Amount", data.suggestedAmount]);
  if (data.suggestedAmount !== parseFloat(data.total_sum)) {
    output.push(["Status", "NEED TO CHECK"]);
  }
  if (data.suggestedAmount === parseFloat(data.total_sum)) {
    output.push(["Status", "LOOKS FINE"]);
  }

  // output file in the same folder
  let path = require("path");
  const os = require("os");
  pathOfFile = pathOfFile.substring(6, pathOfFile.length);
  const filename = path.join(__dirname, `./csv_files/${pathOfFile}-output.csv`);
  fs.writeFileSync(filename, output.join(os.EOL));
}

function finalListItemsPostProcessing() {
  text = text.replace(/[^.,*a-zA-Z0-9 ]/g, "");
  text = text.replace(/\. /g, ".");
  text = text.replace(/, /g, ",");
  text = text.replace(/\s\s+/g, " ");
}

function prcessingOnWholeDescription(text) {
  try {
    text = text.replace(/[^.,*#a-zA-Z0-9 ]/g, "");
    text = text.replace(/\. /g, ".");
    text = text.replace(/, /g, ",");
    text = text.replace(/\s\s+/g, " ");
    textwithoutComma = text.replace(/[^.a-zA-Z0-9 ]/g, "");
    textwithoutComma = textwithoutComma.replace(/\s\s+/g, " ");
    console.log("textwithoutComma", textwithoutComma);
    let totalSumIndex = textwithoutComma.search("TOTAL");
    if (totalSumIndex) {
      if (receiptDetails.total_sum == 0) {
        let amt = textwithoutComma
          .substring(totalSumIndex + 10, totalSumIndex + 10 + 20)
          .split(" ")[0];
        if (!isNaN(amt) && amt.length > 2) {
          receiptDetails.total_sum = amt;
        } else {
          let am2 = textwithoutComma
            .substring(totalSumIndex - 20, totalSumIndex - 1)
            .split(" ");
          let a = am2[am2.length - 1];
          if (!isNaN(a)) {
            receiptDetails.total_sum = a;
          }
        }
      }
    }
    if (!receiptDetails.date) {
      let d = getDateOfPurchase(text);
      receiptDetails.date = d;
    }
  } catch (error) {
    console.log("error in prcessingOnWholeDescription", error);
  }
}

function finalPostProcessing(data) {
  // final post processing
  for (let i = 0; i < data.length; i++) {
    if (isNaN(data[i].unit_price)) {
      data[i].unit_price = "0";
    }
    if (isNaN(data[i].final_price)) {
      data[i].unit_price = "0";
    }
    if (parseFloat(data[i].unit_price) < data[i].quantity) {
      data[i].unit_price =
        data[i].final_price !== "0" ? data[i].final_price : "0";
      data[i].quantity = data[i].final_price !== "0" ? "1" : "0";
    }
    if (parseFloat(data[i].final_price) < data[i].quantity) {
      data[i].final_price =
        data[i].unit_price !== "0" ? data[i].unit_price : "0";
      data[i].quantity = data[i].final_price !== "0" ? "1" : "0";
    }
  }
  return data;
}

function suggestedAmount(data) {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum = sum + parseFloat(data[i].final_price);
  }
  receiptDetails.suggestedAmount = sum;
  // receiptDetails.status = "NEEDS_TO_CHECK";
}

function getListItemsV2(data) {
  arrayOfItems = [];
  // let index = 0;
  for (let i = 0; i < listNumbers.length; i++) {
    for (let j = 0 /* + index*/; j < data.length; j++) {
      if (data[j].description == listNumbers[i]) {
        let str = writeInAString(data, j, i);
        arrayOfItems.push(str.split(" "));
        index = j;
      }
    }
  }

  //......................................................................................................

  arrayOfItems = workingOnDescription(data);

  //......................................................................................................

  let items = listOfItemsV2(arrayOfItems);
  console.log("items------", items);
  let f_items = finalProcessingOnItems(items);
  // receiptDetails.status = "LOOKS_FINE";
  if (receiptDetails.total_sum == 0) suggestedAmount(f_items);
  f_items = finalPostProcessing(f_items);
  return f_items;
}

function finalProcessingOnItems(items) {
  for (let i = 0; i < items.length; i++) {
    items[i].name = items[i].name.trim();
    let u_price = parseFloat(items[i].unit_price);
    let f_price = parseFloat(items[i].final_price);
    if (u_price != f_price) {
      if (u_price < f_price) {
        if (u_price == 0) {
          items[i].u_price = f_price + "";
          items[i].quantity = "1";
        } else {
          let quant = f_price / u_price;
          if (quant > 1) {
            items[i].quantity = parseInt(quant) + "";
          }
        }
      } else if (u_price > f_price) {
        // items[i].unit_price = f_price + ''
        // items[i].final_price = u_price + ''
        if (f_price == 0) {
          items[i].final_price = items[i].unit_price;
          items[i].quantity = "1";
        } else {
          let quant = u_price / f_price;
          if (quant > 1) {
            items[i].quantity = parseInt(quant) + "";
          } else {
            items[i].final_price = items[i].unit_price;
          }
        }
      }
    } else if (u_price == f_price) {
      items[i].final_price = items[i].unit_price;
    } else {
      console.log("no price matched");
    }
  }
  return items;
}

function listOfItemsV2(arrayItems) {
  let finalListOfItems = [];
  console.log("arrayItems", arrayItems);
  for (let i = 0; i < arrayItems.length; i++) {
    let setName = false,
      setProductCode = false,
      setQuantity = false,
      setPrice = false,
      setSCode = false,
      setfinalPrice = false;
    let itemArray = arrayItems[i];
    let itemObject = {
      item_code: "",
      name: "",
      product_code: "",
      quantity: "1",
      unit_price: "0",
      final_price: "0",
      s_code: "",
      other: ""
    };
    itemObject.item_code = itemArray[0];
    for (let k = 1; k < itemArray.length; k++) {
      if (!isNaN(itemArray[k]) && itemArray[k].length > 10) {
        setName = true;
        setProductCode = true;
        itemObject.product_code = itemArray[k];
      } else if (!setName) {
        // set name here
        itemObject.name = itemObject.name + " " + itemArray[k];
        if (
          !isNaN(itemArray[k]) &&
          itemArray[k].length < 6 &&
          itemArray[k].length > 2
        )
          itemObject.unit_price = itemArray[k];
        if (
          !isNaN(itemArray[k]) &&
          itemArray[k].length < 2 &&
          itemArray[k].length > 0
        )
          itemObject.quantity = itemArray[k];
      } else if (
        setProductCode &&
        (itemArray[k].includes("SCode") || itemArray[k].includes("SUode")) &&
        !setSCode
      ) {
        itemObject.s_code = itemArray[k];
        setSCode = true;
      } else if (setProductCode && !setPrice) {
        itemObject.unit_price = itemArray[k];
        setPrice = true;
      } else if (
        setPrice &&
        !isNaN(itemArray[k]) &&
        parseFloat(itemArray[k]) > 10
      ) {
        itemObject.final_price = itemArray[k];
        setfinalPrice = true;
      } else {
        if (
          setfinalPrice &&
          !isNaN(itemArray[k]) &&
          parseFloat(itemArray[k]) < 10
        ) {
          itemObject.quantity = itemArray[k];
        } else {
          itemObject.other = itemArray[k];
        }
      }
    }
    finalListOfItems.push(itemObject);
  }
  receiptDetails.items = finalListOfItems;
  return finalListOfItems;
}

function writeInAString(data, dataIndex, itemIndex) {
  count = 0;
  let str = "";
  while (true) {
    count++;
    let desc = "";
    let index = dataIndex++;
    if (data[index] && data[index].description) {
      desc = data[index].description;
    } else {
      return str.substring(1, str.length);
    }
    desc = desc.replace(/[^.a-zA-Z0-9]/g, "");
    if (desc == listNumbers[itemIndex + 1]) {
      return str.substring(1, str.length);
    }
    if (
      desc.toLowerCase().includes("weight") ||
      desc.toLowerCase().includes("height")
    ) {
      return str.substring(1, str.length);
    }
    str = str + " " + desc;
    if (count == 11) {
      return str.substring(1, str.length);
    }
  }
}

function getTotalSum(OCR_DATA) {
  let storeName = false;
  var pattern = /[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gi;
  for (let i = 1; i < OCR_DATA.length; i++) {
    // store name
    if (
      !storeName &&
      (OCR_DATA[i].description.includes("TELP") ||
        OCR_DATA[i].description.includes("Ph:") ||
        OCR_DATA[i].description.includes("TLP:") ||
        OCR_DATA[i].description.includes("TELP:"))
    ) {
      for (let k = i - 3; k < i; k++) {
        receiptDetails.store_name =
          receiptDetails.store_name + " " + OCR_DATA[k].description;
      }
      storeName = true;
    }

    // date preprocessing
    if (
      OCR_DATA[i].description.includes("www.lottemart.co.id") ||
      OCR_DATA[i].description.includes("mart.co.id") ||
      OCR_DATA[i].description.includes("[REG]")
    ) {
      for (let k = i; k < i + 10; k++) {
        // console.log(OCR_DATA[k].description)
        let date = OCR_DATA[k].description.match(pattern);
        if (date) {
          receiptDetails.date = date[0];
          break;
        }
      }
    }

    // card preprocessing
    if (
      OCR_DATA[i].description.includes("CIMB-DEBIT") ||
      OCR_DATA[i].description.includes("MANUAL") ||
      OCR_DATA[i].description.includes("Sale")
    ) {
      for (let k = i; k < i + 5; k++) {
        if (
          OCR_DATA[k].description.length == 16 ||
          OCR_DATA[k].description.includes("****")
        ) {
          receiptDetails.card_number = OCR_DATA[k].description;
          break;
        }
      }
    }

    //total sum preprocessing
    if (OCR_DATA[i].description.includes("TOTAL")) {
      // if(OCR_DATA[i+1].description.includes("SUM")) {
      //   let amount = "";
      //   amount = isNaN(OCR_DATA[i+2].description) ? 0 : OCR_DATA[i+2].description;
      //   receiptDetails.total_sum = amount;
      // }
      if (OCR_DATA[i + 3].description.includes("DISCOUNT")) {
        receiptDetails.discount = OCR_DATA[i + 4].description;
      }
    }
  }
}

function dataPostProcessing(OCR_DATA) {
  receiptDetails = {
    store_name: "",
    date: "",
    items: [],
    total_sum: 0,
    card_number: "",
    discount: 0
  };

  // let dataArray = OCR_DATA.responses[0].textAnnotations;
  getListItemsV2(OCR_DATA);
}
// dataPostProcessing(OCR_DATA)

String.prototype.replaceAll = function(search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, "g"), replacement);
};

function finalListItemsPostProcessing(text) {
  text = text.replaceAll(/\n/g, " ");
  text = text.replaceAll(/\. /g, ".");
  text = text.replaceAll(/, /g, ",");
  text = text.replaceAll(/[^-.*a-zA-Z0-9 ]/g, "");
  text = text.replaceAll(/\s\s+/g, " ");
  return text.trim();
}

function workingOnDescription(data) {
  // generate array here :
  let firstDesc = data[0].description;
  let text = finalListItemsPostProcessing(firstDesc);
  // console.log(text);
  let array = text.split(" ");
  let newArray = [];
  for (let j = 0; j < listNumbers.length; j++) {
    for (let i = 0; i < array.length; i++) {
      if (listNumbers[j] == array[i]) {
        let otherarray = [];
        for (let k = i; k < i + 9; k++) {
          if (listNumbers[j + 1] == array[k]) {
            break;
          }
          otherarray.push(array[k]);
          if (array[k] && array[k].includes("SCode")) {
            break;
          }
        }
        newArray.push(otherarray);
      }
    }
  }
  console.log(newArray);
  return newArray;
}

// workingOnDescription(OCR_DATA_JSON.responses[0].textAnnotations)

app.listen(6200, () => {
  console.log("Server running on port 6200");
});
