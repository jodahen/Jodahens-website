let qrText = document.getElementById("textInput")
let generateBtn = document.getElementById("generateBtn")

let imgBox = document.getElementById("imgBox")
let qrImage = document.getElementById("qrImage")

const copyQrBtn = document.getElementById("copyQrBtn");

function generateQR(text){
    qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(text);

    imgBox.style.display = "flex"
    copyQrBtn.style.display = "block";
}

generateBtn.addEventListener("click", () => {
    if (!qrText.value.trim()) return;
    generateQR(qrText.value);
});

qrText.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        generateBtn.click();
    }
});




copyQrBtn.addEventListener("click", async () => {
    if (!qrImage.src) return;

    try {
        const response = await fetch(qrImage.src);
        const blob = await response.blob();

        await navigator.clipboard.write([
            new ClipboardItem({ [blob.type]: blob })
        ]);

        copyQrBtn.textContent = "Copied!";
        setTimeout(() => copyQrBtn.textContent = "Copy QR", 1500);
    } catch (err) {
        alert("Clipboard copy is not supported in this browser.");
    }
});
