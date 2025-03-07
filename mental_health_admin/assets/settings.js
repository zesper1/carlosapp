import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Firebase config (USE YOUR CONFIG HERE)
const firebaseConfig = {
    apiKey: "AIzaSyASjkzaM3yQNgr1fRCbRJdXrTVYUVhw78U",
    authDomain: "mental-health-ad7b7.firebaseapp.com",
    projectId: "mental-health-ad7b7",
    storageBucket: "mental-health-ad7b7.firebasestorage.app",
    messagingSenderId: "68583190603",
    appId: "1:68583190603:web:3cbaa296e0657976041dce",
    measurementId: "G-51ERE2SDHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Select elements
const profilePicInput = document.getElementById("profilePic");
const profilePicPreview = document.getElementById("profilePicPreview");
const settingsForm = document.getElementById("settingsForm");

// Debug: Check if elements exist
console.log("Loaded settings.js");
console.log("profilePicInput:", profilePicInput);
console.log("profilePicPreview:", profilePicPreview);
console.log("settingsForm:", settingsForm);

// Load profile data
async function loadProfile() {
    try {
        console.log("Fetching profile data...");
        const userRef = doc(db, "admin", "profile");
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log("Profile Data:", userData);

            document.getElementById("name").value = userData.name || "";
            document.getElementById("email").value = userData.email || "";
            profilePicPreview.src = userData.profilePic || "assets/default-profile.png";
        } else {
            console.warn("No profile found in Firestore.");
        }
    } catch (error) {
        console.error("Error loading profile:", error);
    }
}

// Upload profile picture to Firebase Storage
async function uploadProfilePicture(file) {
    try {
        console.log("Uploading profile picture...");
        const storageRef = ref(storage, `profilePictures/admin-profile.png`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Uploaded successfully! Download URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("Profile picture upload failed.");
    }
}

// Handle profile picture change
profilePicInput.addEventListener("change", async function(event) {
    const file = event.target.files[0];
    if (file) {
        console.log("File selected:", file);
        try {
            const imageUrl = await uploadProfilePicture(file);
            if (imageUrl) {
                profilePicPreview.src = imageUrl;
                await setDoc(doc(db, "admin", "profile"), { profilePic: imageUrl }, { merge: true });
                console.log("Profile picture updated in Firestore.");
            }
        } catch (error) {
            console.error("Failed to update profile picture:", error);
        }
    }
});

// Handle form submission
settingsForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    console.log("Saving profile...");

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    try {
        await setDoc(doc(db, "admin", "profile"), { name, email }, { merge: true });
        console.log("Profile saved successfully!");
        alert("Profile updated successfully!");
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save profile.");
    }
});

// Load profile on page load
loadProfile();
