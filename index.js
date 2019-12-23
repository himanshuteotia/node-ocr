// var dv = require("dv");
// var fs = require("fs");
// var image = new dv.Image("jpg", fs.readFileSync("test21.jpg"));
// var tesseract = new dv.Tesseract("eng", image);
// console.log(tesseract.findText("plain"));


var fs = require("fs");
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

// vendor name = LOTTEMART RATU PLAZA
// date of purchase [REG] 2019-04-21
// line items [name, descrioption, quantity, amount]
// total sum
// card num
const NOT_FOUND = "NOT FOUND";

function replaceMultipleSpaces(text) {
  let string = text
    .replace(/\n/g, " ")
    // .replace(/\r/g, "")
    .replace(/  +/g, "");
  //   console.log("replaceMultipleSpaces : ", string);
  return string;
}
function getVendor(text) {
  let vendorIndex = text.search("LOTTEKART RATU");
  //   console.log("vendorIndex", vendorIndex);
  return vendorIndex ? "LOTTEKART RATU PLAZA" : NOT_FOUND;
}

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

function additionalCheckAmount(text) {
  let value = parseInt(text);
  if (value > 20 && value < 5000000) {
    return true;
  } else {
    return false;
  }
}
function additionalCheckQuantity(text) {
  let value = parseInt(text);
  if (value > 0 && value < 20) {
    return true;
  } else {
    return false;
  }
}

function getAdditionalCheckForName(text) {
  if (text.includes("SCo")) {
    return false;
  } else {
    return true;
  }
}
function getListOfItems(text) {
  let itemsList = [];
  for (let i = 0; i < listNumbers.length; i++) {
    let itemIndex = text.search(listNumbers[i]);
    // console.log("Index : ", itemIndex);
    if (itemIndex == -1) return itemsList;
    // console.log(itemIndex);

    //

    let price, quantity, name;

    // console.log(
    //   text
    //     .substring(itemIndex + 4, itemIndex + 60)
    //     .replace(/\r/g, "")
    //     .split(" ")
    // );
    let arrayOfItems = text
      .substring(itemIndex + 4, itemIndex + 70)
      .replace(/\r/g, "")
      .split(" ");
    console.log(arrayOfItems);
    let flagName = false,
      flagAmount = false,
      flagQuantity = false,
      word_limit_test = false;

    let nextTickCheckForQuantity = false;
    // let name, amount, quantity;

    let skipCount = false;
    let itemObject = {
      name: "",
      amount: 0,
      quantity: 1
    };
    for (var j = 0; j < arrayOfItems.length; j++) {
      arrayOfItems[j] = arrayOfItems[j].replace(/[^.a-zA-Z0-9]/g, "");
      let checkvalue = arrayOfItems[j].replace(/\D/g, "");
      if (parseInt(checkvalue) > 90000000) {
        arrayOfItems[j] = checkvalue;
        word_limit_test = true;
      }
      //   console.log(
      //     "parseInt(arrayOfItems[j])",
      //     isNaN(arrayOfItems[j]),
      //     arrayOfItems[j]
      //   );
      if (
        isNaN(arrayOfItems[j]) &&
        !flagName &&
        getAdditionalCheckForName(arrayOfItems[j])
      ) {
        // console.log("name : ", arrayOfItems[j]);
        itemObject["name"] = itemObject["name"] + " " + arrayOfItems[j];
      }
      if (!isNaN(arrayOfItems[j])) {
        flagName = true;
        if (
          !flagAmount &&
          additionalCheckAmount(arrayOfItems[j]) &&
          word_limit_test
        ) {
          //   console.log("Amount : ", arrayOfItems[j]);
          itemObject["amount"] = arrayOfItems[j];
          flagAmount = true;
        }
        if (
          !flagQuantity &&
          nextTickCheckForQuantity &&
          additionalCheckQuantity(arrayOfItems[j]) &&
          word_limit_test
        ) {
          //   console.log("Quantity : ", arrayOfItems[j]);
          itemObject["quantity"] = arrayOfItems[j];
          flagQuantity = true;
        }
        if (arrayOfItems[j].length > 9) word_limit_test = true;
      }
      if (flagAmount) {
        nextTickCheckForQuantity = true;
      }
      if (flagName && flagAmount && flagQuantity) {
        break;
      }
    }
    itemsList.push(itemObject);
  }
  //   console.log(itemsList);
  // console.log(
  //   text.substring(itemIndex + 4, itemIndex + 28).replace(/[0-9]/g, "")
  // );
}


function getCardNumber(text) {
  let cardIndex = text.search("Sale Amt");
  //   console.log(
  //     text.substring(cardIndex + 10, cardIndex + 26).replace(/[^a-zA-Z0-9]/g, "*")
  //   );
  let cardNo = text
    .substring(cardIndex + 10, cardIndex + 26)
    .replace(/[^a-zA-Z0-9]/g, "*");
  return cardNo ? cardNo : NOT_FOUND;
}

function getTotalSum(text) {
  let sumIndex = text.search("");
}

function main() {
  // let text = fs.readFileSync(process.env.FILE || "textfile.txt", "utf-8");
  //   console.log(text);

  text = "LOTTE Mart Mornh ue1t d LOTTEMART KUNINGAN CITY TELP : 085319404422 Ema1l customer.service@lottemart.co.1 NPWP: 02.902.700.0-007.000 Facebook : Lottemart Indonesia Twitter : GLottemartIndo Website: www.lottemart.co.ld PIN BB : 56F48061 Kasir [REG] :005050388SANDYA SALSHA 2019-04-06 16:33 POS:2015-0115 Nama Harga satuan Qty Harga Jual 001 TONG TJI JASMINE 100'S 8992936661283 45,500 45,500 002 TESSA NAT SOFT HANDTWL 3001> 8992931001220 13,200 13,200 003 LACTACYD FEMWASH WHITE150ML 8938503445207 68.200 68,200 004 LARUTAN PENYEGAR BTL 500ML 8999988888972 8,000 000'91 142,900 ******* ###### CARD 0011 CARD NO TRAN FLAG APPR.CODE TRACE NO. REF NO. Sale Amt MANUAL CIMB-DEBIT 557791******026 AIG FF FF 0 005131730302 090134 005131 142,900 ###*# ###* #*# #### ####*### TOTAL1 ITEM #### : 4 TOTAL QTY ********************** ** xxx* [HAPPY FRES] LOTTE Point Acount Summary LOTTE Members Card: 8711-0000-XXXX-0555 Approval Date/Time: 2019-04-06 16:42:43 Approval No Earned Points Redeemable Points Points Balance 082860717 0 75,400 75,494 005190406201501150001429"
  text = text.replace(/[^.a-zA-Z0-9 ]/g, "");
  text = text.replace(/\s\s+/g, " ");

  // replace multiple spaces
  text = replaceMultipleSpaces(text);

  // find vendor
  let vendor = getVendor(text);
  //   console.log(vendor);

  // find date of purchase
  let date = getDateOfPurchase(text);
  //   console.log(date);

  // find list of items
  let listOfItems = getListOfItems(text);
  //   console.log(listOfItems);
  //   let total_sum = getTotalSum(text);

  let card_number = getCardNumber(text);
  //   console.log(card_number);
  const output = [];
  let row = [];
  row.push(["Vendor name", "Date", "Product Name", "Amount", "Quantity"]);
  output.push(row.join());
  let totalAmount = 0;
  for (var k = 0; k < listOfItems.length; k++) {
    row = [];
    row.push([
      k == 0 ? vendor : "",
      k == 0 ? date : "",
      listOfItems[k].name,
      listOfItems[k].amount * listOfItems[k].quantity,
      listOfItems[k].amount == 0 ? 0 : listOfItems[k].quantity,
      "",
      ""
    ]);
    let s = parseInt(listOfItems[k].amount) * listOfItems[k].quantity;
    totalAmount = totalAmount + s;
    output.push(row.join());
  }

  output.push(["Card Number", card_number]);
  output.push(["Total Amount", totalAmount]);

  // output file in the same folder
  let path = require("path");
  const os = require("os");
  const filename = path.join(__dirname, "output.csv");
  fs.writeFileSync(filename, output.join(os.EOL));
}

main();

function tesrect() {
  let { TesseractWorker } = require("tesseract.js");
  console.log(TesseractWorker);
  const worker = new TesseractWorker();
  worker
    .recognize("./output.jpg", "eng", {
      tessedit_create_pdf: "1"
    })
    .progress(p => {
      console.log("progress", p);
    })
    .then(({ text }) => {
      console.log(text);
      worker.terminate();
    });
}

function jimp() {
  var Jimp = require("jimp");

  // open a file called "lenna.png"
  Jimp.read("./4.jpg", (err, lenna) => {
    if (err) throw err;
    lenna
      //   .resize(256, 900) // resize
      .quality(100) // set JPEG quality
      //   .convolute([[-2, -1, 0], [-1, 1, 1], [0, 1, 2]])
      .color([
        // { apply: "hue", params: [-90] },
        // { apply: "lighten", params: [50] },
        // { apply: "darken", params: [0.9] },
        // { apply: "xor", params: ["#000000"] },
        { apply: "brighten", params: [55] },
        { apply: "tint", params: [80] }
      ])
      //   .opacity(1) //
      //   .brightness(0.9)
      //   .invert()
      .normalize()
      //   .greyscale() // set greyscale
      .write("jimp.jpg"); // save
  });
}

// tesrect();
// jimp();


/* Version 2 data extrection */

/*
let request = require('request');
let rp = require('request-promise');
API_KEY = "AIzaSyABb9p2onXDRe623omAPGHzd8NMeObjWeA";

let googleURL = `https://vision.googleapis.com/v1/files:asyncBatchAnnotate`;
let headers = {
   "Content-Type" : "application/json",
   "Authorization" : "Bearer AIzaSyABb9p2onXDRe623omAPGHzd8NMeObjWeA"
}
let body =  {"requests": [
        {
          "image": {
            "source": {
              "imageUri": "http://isrvi.happyfresh.net/api/r/receipts/3401584/1554529318/original.jpg"
            }
          },
          "features": [
            {
              "type": "DOCUMENT_TEXT_DETECTION"
            }
          ],
          "imageContext": {
            "languageHints": ["en-t-i0-handwrit"]
          }
        }
      ]
    }


async function getDataFromGoogleOCR() {
  try {
    let result = await rp({
      uri : googleURL,
      headers : headers,
      body :body,
      json: true
    })
    console.log(result)
  } catch(error) {
    console.log(error)
  }
}
*/