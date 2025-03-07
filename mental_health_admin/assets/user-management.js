import { supabase } from "./supabase.js"; // ✅ Use the existing instance

console.log("🟢 Supabase Connected in user-management.js");

// ✅ Load Users from Supabase
async function loadUsers() {
    const userTableBody = document.getElementById("user-table-body");
    if (!userTableBody) return;

    userTableBody.innerHTML = ""; // Clear table before loading
    console.log("📂 Fetching users...");

    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("id, email, username") // Removed 'role'
            .limit(1000);

        if (error) throw error;

        if (!users.length) {
            userTableBody.innerHTML = "<tr><td colspan='3'>No users found.</td></tr>";
            return;
        }

        users.forEach((user) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.username || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });

        console.log("✅ Users loaded successfully!");

        // Attach event listeners to delete buttons
        document.querySelectorAll(".delete-btn").forEach((button) => {
            button.addEventListener("click", async function () {
                const userId = this.getAttribute("data-id");
                await deleteUser(userId);
            });
        });

    } catch (error) {
        console.error("❌ Error fetching users:", error.message);
        userTableBody.innerHTML = "<tr><td colspan='3'>Error loading users.</td></tr>";
    }
}

// ✅ Delete User Function
async function deleteUser(userId) {
    if (!userId) return console.error("❌ Invalid User ID");
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
        // Delete from Supabase authentication (ONLY if using Supabase Auth)
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);
        if (authError) console.warn("⚠️ Auth deletion failed:", authError.message);

        // Delete from Supabase database
        const { error: dbError } = await supabase.from("users").delete().eq("id", userId);
        if (dbError) throw dbError;

        console.log(`🗑️ User ${userId} deleted!`);
        loadUsers(); // Reload users
    } catch (error) {
        console.error("❌ Error deleting user:", error.message);
        alert("Failed to delete user. See console for details.");
    }
}

// ✅ Load users on page load
document.addEventListener("DOMContentLoaded", () => {
    loadUsers();
});
