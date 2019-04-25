
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({
  origin: true
});

admin.initializeApp(functions.config().firebase);
var db = admin.firestore();


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//set profile picture imageURL
//PARAMETERS: userID, imageURL
exports.setProfileImage = functions.https.onRequest((request, response) => {
  var userID = request.body.userID;
  var image = request.body.imageURL;

  //don't check downloadURL since it can be null
  if (userID == null) {
    throw new Error("Must pass 'userID' in body of request");
  }
  else {
    if (image == null) {
      image = "http://s3.amazonaws.com/37assets/svn/765-default-avatar.png";
    }
    var userRef = db.collection("users").doc(userID);
    userRef.get().then(function(doc) {
      if (doc.exists) {
        userRef.update({
          "image":image
        })
        .then(function() {
          response.send({
            "success":true
          });
          return({"success":true});
        })
        .catch(function(error) {
          throw new Error(error);
        });
      }
      else {
        throw new Error("User does not exist");
      }
    })
    .catch(function(error) {
      throw new Error(error);
    });
  }
});

//PARAMETERS: file
exports.addImageToStorage = functions.https.onRequest((request, response) => {
  var file = request.body.file;

  var fileName = file.name;
  var ref = st.ref("profile_images/" + fileName);

  var task = ref.put(file);

  task.on("state_changed", function(snapshot){
    //while uploading
  },
  function error(error){
    console.log(error.message);
  },
  function(){
    //on complete
    task.snapshot.ref.getDownloadURL().then(function(downloadURL){
      console.log(downloadURL);
      response.send(downloadURL);
      return;
    })
  });
});

//PARAMETERS; procductBacklog (the path to the file),
//            sprintBacklog (the path to the file),
//            productOwner, scrumMaster,
//            sprintPlanning (date), sprintRetrospective, sprintReview,
//            team (array of memberID's)
exports.createSprint = functions.https.onRequest((request, response) => {
  var sprint = {
    dailyScrum: new Date(),
    openProductBacklog: false, //not sure what this is
    openSprintBacklog: false, //not sure what this is
    productBacklog: request.body.productBacklog,
    productOwner: productOwner,
    scrumMaster: scrumMaster,
    sprintBacklog: sprintBacklog,
    sprintPlanning: sprintPlanning,
    sprintRetrospective: sprintRetrospective,
    sprintReview: sprintReview,
    team: team
  }
  db.collection("sprints").add(sprint).then(function() {
    console.log("Sprint successfully added!");
    response.send("success");
  }).catch(function(error) {
    console.error("Error adding user: ", error);
    throw new Error(error);
  });
});


//PARAMETERS: filePath
exports.getFile = functions.https.onRequest((request, response) => {
  var filePath = request.body.filePath;
  if(filePath == null){
    throw new Error("No file path");
  }
  var ref = st.refFromURL(filePath);

  console.log(ref);
  console.log(ref.Name);
  response.send("success");
});


//PARAMETERS: workspace, user
exports.leaveGroup = functions.https.onRequest((request, response) => {
  return cors(request, response, () => {
    var workspace = request.body.workspace;
    var user = request.body.user;

    console.log(workspace);
    console.log(user);
    if (workspace == null) {
      throw new Error("Must pass workspace in body of request");
    }
    if (user == null) {
      throw new Error("Must pass user in body of request");
    }


    var userDoc = db.collection("users").doc(user);
    var wsDoc = db.collection("workspaces").doc(workspace);


    userDoc.update({
      workspaces: admin.firestore.FieldValue.arrayRemove(workspace)
    }).then(function(){
      wsDoc.get().then(doc => {
        console.log(doc.data().users.length);
        if(doc.data().users.length == 0 || doc.data().users.length == 1 && doc.data().users[0] == user){
          //delete the sprints
          var sprints = doc.data().sprints;
          for(var i = 0; i < sprints.length; i++){
            db.collection("sprints").doc(sprints[i]).delete().catch(function (error){
              throw new Error(error);
            });
          }

          //delete the doc
          wsDoc.delete().then(function(){
            response.send({"success": true});
          }).catch(function (error){
            throw new Error(error);
          });
        }
        else{
          console.log(doc.data().users.length);
          wsDoc.update({
            users: admin.firestore.FieldValue.arrayRemove(user)
          }).then(function(){
            response.send({"success": true});
          }).catch(function(error){
            throw new Error(error);
          });
        }
      });
    });
  });
});
