// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase configuration (Ensure this is correct)
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
console.log("Firestore initialized!");

// Reference to the "doctors" collection
const doctorsCollection = collection(db, "doctors");

// Function to fetch and display doctors
async function fetchDoctors() {
    try {
        const querySnapshot = await getDocs(doctorsCollection);
        const tableBody = document.getElementById("doctor-table-body");
        tableBody.innerHTML = ""; // Clear existing data

        querySnapshot.forEach((doc) => {
            const doctor = doc.data();
            const row = `
                <tr>
                    <td>${doctor.name}</td>
                    <td>${doctor.specialty}</td>
                    <td>${doctor.email}</td>
                    <td>${doctor.phone}</td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });

        console.log("Doctors fetched successfully!");
    } catch (error) {
        console.error("Error fetching doctors:", error);
    }
}

// Function to add a new doctor
document.getElementById("addDoctorForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    const name = document.getElementById("doctorName").value.trim();
    const specialty = document.getElementById("doctorSpecialty").value.trim();
    const email = document.getElementById("doctorEmail").value.trim();
    const phone = document.getElementById("doctorPhone").value.trim();

    if (!name || !specialty || !email || !phone) {
        alert("Please fill in all fields.");
        return;
    }

    try {
        await addDoc(doctorsCollection, {
            name: name,
            specialty: specialty,
            email: email,
            phone: phone
        });

        alert("Doctor added successfully!");
        fetchDoctors(); // Refresh table
        document.getElementById("addDoctorForm").reset();

        // Close modal
        var modal = bootstrap.Modal.getInstance(document.getElementById("addDoctorModal"));
        modal.hide();

        console.log("Doctor added:", { name, specialty, email, phone });
    } catch (error) {
        console.error("Error adding doctor:", error);
        alert("Error adding doctor. Check console for details.");
    }
});

// Fetch doctors when page loads
document.addEventListener("DOMContentLoaded", fetchDoctors);
