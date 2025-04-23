
document.addEventListener("DOMContentLoaded", () => {
    const tBody = document.querySelector('#productTable tbody'); 
    const apiUrl = "http://localhost:3001/api/products";
    const addButton = document.querySelector("#btnAddProducts");

    fetch(apiUrl).then(res => res.json()).then(data => {
        data.forEach(item => renderRow(item));
        new DataTable("#productTable", {
            paging: false,
            info: false,
            searching: false,
            lengthChange: false,
        })
    }).catch( error => console.log(error));

    function renderRow(item){
        const tr = document.createElement("tr");
        tr.dataset.id = item._id;
        tr.innerHTML = `
            <td> ${item._id} </td>
            <td> ${item.name} </td>
            <td> ${item.category_id.name} </td>
            <td> ${item.description} </td>
            <td> ${item.price} </td>
            <td> ${item.quantity_in_stock} </td>
            <td><img src="http://localhost:3001${item.img_url}" style="width:60px; height:60px" /></td>
            <td> ${item.is_active} </td>
                <button class="btn btn-sm btn-warning btnEdit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btnDelete">
                    <i class="fas fa-trash"></i>
                </button>
        `

        tBody.appendChild(tr)

        tr.querySelector(".btnEdit").addEventListener("click", () => {
            openEditModal(item, tr)
        });
        tr.querySelector(".btnDelete").addEventListener("click", () => {
            if(confirm(` Bạn có chắc muốn xóa sản phẩm ${item.name} không `)) {

                fetch(`${apiUrl}/${item._id}`, {
                    method: "DELETE",
                }).then(res => res.json).then(() => tr.remove()).catch(error => console.log(error));
            }
        });
    }


    function createModal(title, body) {
        const modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${title}</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>×</span>
                </button>
            </div>
            <div class="modal-body">
                ${body}
            </div>
            </div>
            </div>
        `
        document.body.appendChild(modal);
        $(modal).modal("show");
        $(modal).on("hidden.bs.modal", function() {  // kick hoạt khi modal đã bị ẩn hoàn toàn
            modal.remove();
        });
        return modal;
    }

    addButton.addEventListener("click", () => {
        const formHtml = `
        <form id="productForm">
            <div class="form-group">
                <label for="productName">Tên sản phẩm</label>
                <input type="text" class="form-control" id="productName" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="producDescription">Mô tả </label>
                <input type="text" class="form-control" id="productDescription" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productPrice">Giá sản phẩm</label>
                <input type="text" class="form-control" id="productPrice" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productQuantityinstock">Số lượng trong kho</label>
                <input type="text" class="form-control" id="productQuantityinstock" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productImgurl">Ảnh sản phẩm</label>
                <input type="file" accept="image/*" class="form-control" id="productImgurl">
                <img id="previewImage" src="" style="width: 100px; height: 100px; margin-top: 10px; display: none;">
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productIsactive">Trạng thái</label>
                <input type="text" class="form-control" id="productIsactive" required>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Lưu sản phẩm</button>
            </form>
        `;
        const modal = createModal("Thêm sản phẩm mới", formHtml);

        const fileInput = document.getElementById("productImgurl");
        const preview = document.getElementById("previewImage");
        fileInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                preview.src = e.target.result;
                preview.style.display = "block";
            };
            reader.readAsDataURL(file);
            }
        });

        modal.querySelector("#productForm").addEventListener("submit", async(e) => {
            e.preventDefault();
            e.stopPropagation();

            const newProduct = {
                name: document.querySelector("#productName").value, 
                description: document.querySelector("#productDescription").value,
                price: document.querySelector("#productPrice").value,
                quantity_in_stock: document.querySelector("#productQuantityinstock"),
                img_url: preview.src,
                is_active: document.querySelector("#productIsactive").value,
            }
            try {
                await fetch(apiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newProduct)
                })
                .then(res => res.json()).then(data => {
                    renderRow(data);
                    $(modal).modal("hide");
                    modal.remove();
                }).catch(error => console.log(error));
            } catch (error) {
                console.log(error);
            }
            
        })
    });

    function openEditModal(item,row) {
        const formHtml = `
        <form id="productForm">
            <div class="form-group">
                <label for="productName">Tên sản phẩm</label>
                <input type="text" class="form-control" id="productName" value="${item.name}" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="producDescription">Mô tả </label>
                <input type="text" class="form-control" id="productDescription" value="${item.description}" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productPrice">Giá sản phẩm</label>
                <input type="text" class="form-control" id="productPrice" value="${item.price}" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productQuantityinstock">Số lượng trong kho</label>
                <input type="text" class="form-control" id="productQuantityinstock" value="${item.quantity_in_stock}" required>
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productImgurl">Ảnh sản phẩm</label>
                <input type="file" accept="image/*" class="form-control" id="editProductImgurl">
            <img id="editPreviewImage" src="http://localhost:3001${
                item.img_url || ""
            }" style="width: 100px; height: 100px; margin-top: 10px;">
            </div>
            <form id="productForm">
            <div class="form-group">
                <label for="productIsactive">Trạng thái</label>
                <input type="text" class="form-control" id="productIsactive" value="${item.is_active}" required>
            </div>
            <button type="submit" class="btn btn-primary mt-3">Lưu sản phẩm</button>
            </form>
        `;
        const modal = createModal(" Chỉnh sửa sản phẩm", formHtml);
        modal.querySelector("#productForm").addEventListener("submit", () => {
            const updatedProduct = {
                name: document.querySelector("#productName").value,
                description: document.querySelector("#productDescription").value,
                price: document.querySelector("#productPrice").value,
                quantity_in_stock: document.querySelector("#productQuantityinstock").value,
                img_url: document.querySelector("#productImgurl").value,
                is_active: document.querySelector("#productIsactive").value,
            }
            fetch(`${api}/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct)
            })
            .then(res => res.json()).then(data => {
                row.querySelector("td:nth-child(2)").textContent = updatedProduct.name;
                row.querySelector("td:nth-child(3)").textContent = updatedProduct.description;
                row.querySelector("td:nth-child(4)").textContent = updatedProduct.price;
                row.querySelector("td:nth-child(5)").textContent = updatedProduct.quantity_in_stock;
                row.querySelector("td:nth-child(6)").textContent = updatedProduct.img_url;
                row.querySelector("td:nth-child(7)").textContent = updatedProduct.is_active;
            })
        })
    }
});

