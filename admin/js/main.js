document.addEventListener("DOMContentLoaded", async() => {
    const footerContainer = document.getElementById("footer");
    const sidebarContainer = document.getElementById("sidebar");
    const headerContainer = document.getElementById("header");

    fetch("./layouts/footer.html").then(res => res.text()).then(data => footerContainer.innerHTML = data).catch(error => console.log(error));
    fetch("./layouts/sidebar.html").then(res => res.text()).then(data => sidebarContainer.innerHTML = data).catch(error => console.log(error));
})