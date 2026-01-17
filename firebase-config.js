// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8GViqPyckbaKXNc_0B8Qwz8hHKas5x9k",
    authDomain: "jaya-raut.firebaseapp.com",
    databaseURL: "https://jaya-raut-default-rtdb.firebaseio.com", // You need to verify this URL in Firebase Console
    projectId: "jaya-raut",
    storageBucket: "jaya-raut.firebasestorage.app",
    messagingSenderId: "692389445243",
    appId: "1:692389445243:web:63d71a67d99114b7c6ecde",
    measurementId: "G-E4S9ZPWEB2"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

// Admin authentication (only you can edit)
window.isAdmin = false;

auth.onAuthStateChanged((user) => {
    if (user) {
        window.isAdmin = true;
        console.log('✅ Signed in as admin:', user.email);
    } else {
        window.isAdmin = false;
        console.log('👀 Viewing in read-only mode');
    }
});

// Sign out function
window.signOut = () => {
    auth.signOut();
};
