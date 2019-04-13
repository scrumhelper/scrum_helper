const config = {
  apiKey: "AIzaSyAWL2vE8qc9Q9zNdK7-RnPeDpgvEn4Pfis",
  authDomain: "scrum-helper-73afc.firebaseapp.com",
  databaseURL: "https://scrum-helper-73afc.firebaseio.com",
  projectId: "scrum-helper-73afc",
  storageBucket: "scrum-helper-73afc.appspot.com",
  messagingSenderId: "548962340162"
};

const publicValidKey =
  "BKdX85G1UAjOq0k95sRv7a7LWeWLt1k6f-LZcWIA4a3T0-JPZ4IiKF5wvAoTc_4sl4Y3NRA3Vpl21-a7HyDW6dQ";
const serverKey =
  "AAAAf9C0jUI:APA91bHWqvHDMxYCRFHuFKu24TSR530dcSNVBWUtc7oso2XaRzSwmaAEci7GT3oGQc-penvGAZxk3jlWeY6jI9h0FZR2E3G6hIOhn7ivatZx1IikkX1XyzBMVLHMKZcYiiYXCtZFl799";

importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

firebase.initializeApp(config);

const messaging = firebase.messaging();
messaging.usePublicVapidKey(publicValidKey);

messaging.setBackgroundMessageHandler(function(payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  var notificationTitle = "Background Message Title";
  var notificationOptions = {
    body: "Background Message body.",
    icon: "/firebase-logo.png"
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener("notificationclick", function(event) {
  console.log("[Service Worker] Notification click Received.");
  event.notification.close();
  event.waitUntil(clients.openWindow("http://localhost:7000/#/messages/"));
});

// // Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(function() {
//   messaging
//     .getToken()
//     .then(function(refreshedToken) {
//       console.log("Token refreshed.");
//       // Indicate that the new Instance ID token has not yet been sent to the
//       // app server.
//       setTokenSentToServer(false);
//       // Send Instance ID token to app server.
//       sendTokenToServer(refreshedToken);
//       // ...
//     })
//     .catch(function(err) {
//       console.log("Unable to retrieve refreshed token ", err);
//       showToken("Unable to retrieve refreshed token ", err);
//     });
// });
