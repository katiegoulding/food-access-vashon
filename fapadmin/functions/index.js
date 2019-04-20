const functions = require('firebase-functions');
const admin = require("firebase-admin");
const pdfmake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

pdfMake.vfs = vfsFonts.pdfMake.vfs;

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {

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

    ids.forEach((id) => {
        console.log(id);
        let pOrg = id.partnerOrg;
        let code = id.id;
        let qr = { qr: code, fit: 100, margin: [50, 50] };
        console.log(JSON.stringify(qr));
        documentDefinition.content.push(qr);
    });

    console.log(JSON.stringify(documentDefinition));

    const pdfDoc = pdfMake.createPdf(documentDefinition);
    pdfDoc.getBase64((data) => {
        response.writeHead(200,
            {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'attachment;filename="filename.pdf"'
            });

        const download = Buffer.from(data.toString('utf-8'), 'base64');
        response.end(download);
    });

});

exports.createProfile = functions.auth.user().onCreate((user) => {
    return admin.database().ref(`/users/${user.uid}`).set({
        email: user.email
    });
});

function safelyParseJSON(response, json) {
    var parsed;

    try {
        parsed = JSON.parse(json);
    } catch (e) {
        response.status(500).json({
            message: 'inproper JSON'
        });
    }
    return parsed; // will be undefined if it's a bad json!
}
