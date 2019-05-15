const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdfmake = require("pdfmake/build/pdfmake");
const vfsFonts = require("pdfmake/build/vfs_fonts");
const cors = require("cors")({ origin: true });

pdfMake.vfs = vfsFonts.pdfMake.vfs;

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    // let json = safelyParseJSON(response, request.body);

    // response.status(200).json({
    //     message: 'It worked!'
    // });

    let ids = request.body.ids;
    let year = request.body.year;

    console.log(request.body.ids.length);

    var documentDefinition = {
      content: []
    };

    ids.forEach(id => {
      console.log(id);
      let pOrg = id.partnerOrg;
      let code = id.id;
      let qr = { qr: code, fit: 100, margin: [50, 50] };
      console.log(JSON.stringify(qr));
      documentDefinition.content.push(qr);
    });

    //documentDefinition.append(pageMargins: [ 0, 0, 0, 0 ]);

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
