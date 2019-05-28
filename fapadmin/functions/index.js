const functions = require("firebase-functions");
const admin = require("firebase-admin");
const pdfmake = require("pdfmake/build/pdfmake");
const vfsFonts = require("pdfmake/build/vfs_fonts");
const cors = require("cors")({ origin: true });
var os = require("os");
const path = require("path");

pdfMake.vfs = vfsFonts.pdfMake.vfs;

admin.initializeApp();

exports.changeRole = functions.https.onCall((data, context) => {
  // get user and add admin custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        role: data.role.toLowerCase()
      });
    })
    .then(() => {
      return {
        message: `Success! ${
          data.email
        } has been made a ${data.role.toLowerCase()}.`
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
        message: `Success! ${data.email} has been deleted.`
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
