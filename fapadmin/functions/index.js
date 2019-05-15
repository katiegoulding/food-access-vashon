const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdfmake = require("pdfmake/build/pdfmake");
const vfsFonts = require("pdfmake/build/vfs_fonts");
const cors = require("cors")({ origin: true });
var os = require("os");
const path = require("path");
const fileName = "bucktemplateprintpage.jpg";
const tempFilePath = path.join(os.tmpdir(), fileName);
const options = {
  // The path to which the file should be downloaded, e.g. "./file.txt"
  destination: tempFilePath
};

pdfMake.vfs = vfsFonts.pdfMake.vfs;

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

async function downloadImg() {
  var defaultStorage = admin.storage();
  var bucket = defaultStorage.bucket("gs://fapadmin-97af8.appspot.com");
  var file = bucket.file(fileName);
  await file.download(options);
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    let promise = downloadImg();
    let ids = request.body.ids;
    let year = request.body.year;

    console.log(request.body.ids.length);

    var documentDefinition = {
      content: []
    };

    // PDF VARIABLES(in mm):

    var count = 1;

    ids.forEach(id => {
      console.log(id);
      let pOrg = id.partnerOrg;
      let code = id.id;
      let qr;
      if (count % 4 == 0 && count !== ids.length) {
        qr = {
          qr: code,
          fit: 48.96,
          margin: [380.88, 0, 0, 142.56],
          pageBreak: "after"
        };
      } else if (count % 4 == 1) {
        qr = { qr: code, fit: 48.96, margin: [380.88, 50.904, 0, 190] };
      } else {
        qr = { qr: code, fit: 48.96, margin: [380.88, 0, 0, 190] };
      }
      console.log(JSON.stringify(qr));
      documentDefinition.content.push(qr);
      count++;
    });

    documentDefinition.pageMargins = [0, 0, 0, 0];

    Promise.all([promise])
      .then(doesPass => {
        documentDefinition.background = [
          {
            image: tempFilePath,
            width: 792
          }
        ];

        console.log(JSON.stringify(documentDefinition));

        const pdfDoc = pdfMake.createPdf(documentDefinition);
        pdfDoc.getBase64(data => {
          response.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment;filename="vouchers.pdf"'
          });

          const download = Buffer.from(data.toString("utf-8"), "base64");
          response.end(download);
        });
      })
      .catch(error => {
        console.log(error);
      });
  });
});

exports.changeRole = functions.https.onCall((data, context) => {
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        role: data.role
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made a ${data.role}.`
      };
    })
    .catch(err => {
      return err;
    });
});

exports.deleteUser = functions.https.onCall((data, context) => {
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().deleteUser(user.uid);
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made a deleted.`
      };
    })
    .catch(err => {
      return err;
    });
});

exports.deleteData = functions.auth.user().onDelete(user => {
  return admin.database().ref("/users/{user.uid}").deleteData;
});

function safelyParseJSON(response, json) {
  var parsed;

  try {
    parsed = JSON.parse(json);
  } catch (e) {
    response.status(500).json({
      message: "inproper JSON"
    });
  }
  return parsed; // will be undefined if it's a bad json!
}
