{
  "rules": {
    "messages": {
      ".read": "auth !== null",
      ".write": "auth !== null"
    },
    "fcmTokens": {
      "$token": {
        ".read": "data.val() === auth.uid", // Users can only read their own device tokens
        ".write": "!data.exists() || data.val() === auth.uid", // Users can only write to their own device tokens
        ".validate": "newData.val() === auth.uid" // value has to be the UID of the user
      }
    }
  }
}



<!-- Import and configure the Firebase SDK -->
<!-- These scripts are made available when the app is served or deployed on Firebase Hosting -->
<!-- If you do not want to serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup -->
<script src="/__/firebase/4.1.3/firebase.js"></script>
<script src="/__/firebase/init.js"></script>