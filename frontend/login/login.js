document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const msg = document.getElementById("msg");

    if(!email || !password){
        msg.textContent = "All fields are required.";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if(res.ok){
            msg.textContent = "✅ Logged in! Redirecting...";
            setTimeout(() => window.location.href = "../settings.html", 500);
        } else {
            msg.textContent = "❌ " + data.error;
        }
    } catch(err) {
        msg.textContent = "❌ " + err.message;
    }
});
