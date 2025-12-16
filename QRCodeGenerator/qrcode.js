let qrText = document.getElementById("textInput")
let generateBtn = document.getElementById("generateBtn")

let imgBox = document.getElementById("imgBox")
let qrImage = document.getElementById("qrImage")

function generateQR(text){
    qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(text);
}

generateBtn.addEventListener('click', () => {
    generateQR(qrText.value)

    imgBox.style.display = "flex";
})