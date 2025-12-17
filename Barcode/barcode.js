const input = document.getElementById("textInput");
const button = document.getElementById("generateBtn");
const barcodeImage = document.getElementById("barcodeImage");
const imgBox = document.getElementById("imgBox");

button.addEventListener("click", generateBarcode);

function generateBarcode() {
    const value = input.value.trim();

    if (value === "") {
        alert("Please enter a value");
        return;
    }

    imgBox.style.display = "flex";

    JsBarcode(barcodeImage, value, {
        format: "CODE128",
        lineColor: "#000",
        width: 3,
        height: 120,
        margin: 10,
        displayValue: true
    });
}
