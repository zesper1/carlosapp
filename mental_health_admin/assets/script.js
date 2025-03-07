// ✅ Import Supabase
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// ✅ Supabase Configuration
const supabaseUrl = "https://bzdczktvzkedsptxojrw.supabase.co"; // 🔹 Replace with your Supabase URL
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZGN6a3R2emtlZHNwdHhvanJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTQ3NjksImV4cCI6MjA1NjU3MDc2OX0.RzCWvFmyrpL6JiFC-Lno8ozryekHJOSeRxnhjhKVh9g"; // 🔹 Replace with your Supabase anon key
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🟢 Supabase Connected!");

// ✅ Wait for the DOM to Load
document.addEventListener("DOMContentLoaded", async function () {
    console.log("🚀 Script Loaded!");

    // ✅ Handle Admin Login
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            console.log("🔍 Checking admin credentials...");

            try {
                // ✅ Fetch admin user from Supabase
                let { data: admin, error } = await supabase
                    .from("admin_users") // Ensure you have an "admin_users" table
                    .select("id, email, password") // Get only required fields
                    .eq("email", username)
                    .single();

                if (error || !admin) {
                    throw new Error("Invalid email or password!");
                }

                // ✅ Compare entered password with stored hash (if using hashing)
                const isPasswordValid = admin.password === password; // 🔹 Replace with hashing check
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password!");
                }

                console.log("✅ Admin Login Successful! Redirecting...");
                sessionStorage.setItem("adminLoggedIn", "true"); // Save session
                window.location.href = "dashboard.html";

            } catch (error) {
                alert(`❌ ${error.message}`);
                console.error("❌ Login Error:", error);
            }
        });
    }

    // ✅ Redirect if Not Logged In (For Dashboard Pages)
    if (window.location.pathname.includes("dashboard.html")) {
        if (sessionStorage.getItem("adminLoggedIn") !== "true") {
            alert("⚠️ Unauthorized access! Please log in.");
            window.location.href = "index.html";
        }
    }

    // ✅ Load Feedback Data (Dashboard)
    const feedbackList = document.getElementById("feedback-list");
    if (feedbackList) {
        try {
            console.log("📂 Fetching feedbacks...");

            let { data: feedbacks, error } = await supabase.from("feedbacks").select("*");

            if (error) throw error;

            feedbacks.forEach((data) => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${data.user}</td><td>${data.feedback}</td><td>${data.date}</td>`;
                feedbackList.appendChild(row);
            });

            console.log("✅ Feedbacks loaded successfully!");
        } catch (error) {
            console.error("❌ Error fetching feedbacks:", error);
        }
    }

    // ✅ Sidebar Navigation
    const sidebarLinks = document.querySelectorAll(".sidebar a");
    sidebarLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = link.getAttribute("href");
            console.log(`🔗 Navigating to ${page}`);
            window.location.href = page;
        });
    });

    // ✅ Logout Functionality
    const logoutBtn = document.getElementById("logout");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.removeItem("adminLoggedIn");
            window.location.href = "index.html";
        });
    }
});
