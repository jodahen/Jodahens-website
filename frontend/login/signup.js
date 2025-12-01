document.getElementById("signupBtn").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if(!username || !email || !password) {
        msg.textContent = "All fields are required.";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/auth/signup", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await res.json();

        if(res.ok){
            msg.textContent = "✅ Account created! Redirecting...";
            setTimeout(() => window.location.href = "../settings.html", 1000);
        } else {
            msg.textContent = "❌ " + data.error;
        }
    } catch(err) {
        msg.textContent = "❌ " + err.message;
    }
});
