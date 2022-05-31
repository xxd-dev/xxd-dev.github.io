function main() {
    fetch("../readme.md")
    .then((response) => response.text())
    .then((html) => {
        document.getElementById("readme").innerHTML = html;
    });
}