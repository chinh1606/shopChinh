document.addEventListener("DOMContentLoaded", async() => {
    const footerContainer = document.getElementById("footer-container");
    const headerContainer = document.getElementById("header-container");

    fetch("./layouts/footer.html").then(res => res.text()).then(data => footerContainer.innerHTML = data).catch(error => console.log(error));
    fetch("./layouts/header.html").then(res => res.text()).then(data => headerContainer.innerHTML = data).catch(error => console.log(error));
})