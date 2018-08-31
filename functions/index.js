
// Import the Firebase SDK for Google Cloud Functions.
const functions = require('firebase-functions');
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Adds a message that welcomes new users into the chat.
exports.addWelcomeMessages = functions.auth.user().onCreate(event => {
    const user = event.data;
    console.log('A new user signed in for the first time.');
    const fullName = user.displayName || 'Anonymous';

    // Saves the new welcome message into the database
    // which then displays it in the FriendlyChat clients.
    return admin.database().ref('messages').push({
        name: 'Firebase Bot',
        photoUrl: '/images/firebase-logo.png', // Firebase logo
        text: `${fullName} signed in for the first time! Welcome!` // Using back-ticks.
    }).then(() => console.log('Welcome message written to database.'));
});

// TODO(DEVELOPER): Write the blurOffensiveImages Function here.



// TODO(DEVELOPER): Write the sendNotifications Function here.
// Sends a notifications to all users when a new message is posted.
exports.sendNotifications = functions.database.ref('/messages/{messageId}').onCreate(event => {
    const snapshot = event.data;

    // Notification details.
    const text = snapshot.val().text;
    const payload = {
        notification: {
            title: `${snapshot.val().name} posted ${text ? 'a message' : 'an image'}`,
            body: text ? (text.length <= 100 ? text : text.substring(0, 97) + '...') : '',
            icon: snapshot.val().photoUrl || '/images/profile_placeholder.png',
            click_action: `https://${functions.config().firebase.authDomain}`
        }
    };

    // Get the list of device tokens.
    return admin.database().ref('fcmTokens').once('value').then(allTokens => {
        if (allTokens.val()) {
            // Listing all tokens.
            const tokens = Object.keys(allTokens.val());

            // Send notifications to all tokens.
            return admin.messaging().sendToDevice(tokens, payload).then(response => {
                // For each message check if there was an error.
                const tokensToRemove = [];
                response.results.forEach((result, index) => {
                    const error = result.error;
                    if (error) {
                        console.error('Failure sending notification to', tokens[index], error);
                        // Cleanup the tokens who are not registered anymore.
                        if (error.code === 'messaging/invalid-registration-token' ||
                            error.code === 'messaging/registration-token-not-registered') {
                            tokensToRemove.push(allTokens.ref.child(tokens[index]).remove());
                        }
                    }
                });
                return Promise.all(tokensToRemove);
            });
        }
    });
});