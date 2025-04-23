document.addEventListener("DOMContentLoaded", async() => {
    const categoryList = document.getElementById("category-list");
    const productList = document.getElementById("product-list");
    const apiUrl = "http://localhost:3001/api";
    let allCategory = [];
    let allProduct = [];

    try {
        const categoryResponse = await fetch(`${apiUrl}/categories`)
        if(!categoryResponse.ok) throw new Error("Lỗi khi gọi API");
        allCategory = await categoryResponse.json();
        
        categoryList.innerHTML = `<div class="category-item active" data-category="all">Tất cả</div>`;
        allCategory.forEach(category => {
            const categoryItem = document.createElement("div")
            categoryItem.dataset.category = category._id;
            categoryItem.textContent = category.name;
            categoryItem.className = "category-item";
            categoryList.appendChild(categoryItem)
        })
    } catch (error) {
        console.log(error);
    }

    try {
        const productResponse = await fetch(`${apiUrl}/products`)
        if(!productResponse.ok) throw new Error(" Lỗi khi gọi API");
        allProduct = await productResponse.json();
        
        renderProducts(allProduct)
    } catch (error) {
        console.log(error);
    }

    function renderProducts(products) {
        productList.innerHTML = "";

        if(products.length === 0) {
            productList.innerHTML =`
            <div class="col-12 text-center text-muted">
                <p>Không tìm thấy sản phẩm nào trong danh mục này.</p>
            </div>
            `
        }
        products.forEach(product => {
            const productItem = document.createElement("div")
            productItem.innerHTML = `
                <a href="product-details.html?id=${product._id}"> 
                    <div class="card product-card"> 
                        <img src="http://localhost:3001${product.img_url}" class="card-img-top product-image" alt="${product.name}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text text-danger fw-bold">${product.price.toLocaleString()} VND</p>
                        </div>
                    </div>
                </a>
            `
            productList.appendChild(productItem);
        })
    }

    categoryList.addEventListener("click", (e) => {
        const categoryItem = e.target.closest(".category-item")
        if(!categoryItem) return;
        
        document.querySelectorAll(".category-item").forEach(item => {
            item.classList.remove("active");
        })

        categoryItem.classList.add("active");

        const categoryId = categoryItem.dataset.category 
        if(categoryId === "all") {
            renderProducts(allProduct) 
        } else {
            const filterProducts = allProduct.filter(product => product.category_id._id === categoryId);
            renderProducts(filterProducts);
        }
    }) 
})