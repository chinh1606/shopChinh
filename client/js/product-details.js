document.addEventListener("DOMContentLoaded", async() => {
    const productDetailElement = document.getElementById("product-detail");
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");
    const apiurl = "http://localhost:3001/api";

    try {
        const productDetail = await fetch(`${apiurl}/products/${productId}`)
        if(!productDetail.ok) throw new Error("Lỗi khi gọi API")
        const data = await productDetail.json()

        productDetailElement.innerHTML = `
        <div class="row" id="product-detail-container" data-id="${data._id}">
        <div class="col-md-4">
            <img src="http://localhost:3001${
            data.img_url ||
            "https://via.placeholder.com/400x400?text=Chưa+có+ảnh"
            }"
                class="img-fluid product-image img"
                alt="${data.name}">
        </div>
        <div class="col-md-8">
            <div class="card detail-card p-4">
            <h2>${data.name}</h2>
            <p class="text-danger fw-borderld fs-4 clrchange">${data.price.toLocaleString()} VND</p>
            <p class="text-muted">${
                data.description || "Chưa có mô tả"
            }</p>
            <button class="btn btn-lg mt-3 btn-add-to-cart" data-id="${
                data._id
            }">Thêm vào giỏ hàng</button>
            </div>
        </div>
        </div>
    `;
    initAddToCartButtons();
    } catch (error) {
        console.log(error);
    }
})