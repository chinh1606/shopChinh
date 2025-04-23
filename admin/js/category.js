document.addEventListener("DOMContentLoaded", () => {     // ghi nhận sự kiện khi toàn bộ tài liệu HTML chạy xong 
    const tBody = document.querySelector("#categoryTable tbody");
    const apiUrl = "http://localhost:3001/api/categories";
    const addButton = document.querySelector("#btnAddCategory"); 
    
    fetch(apiUrl).then(res => res.json()).then(data => {
        data.forEach(item => renderRow(item));
        new DataTable("#categoryTable", {
            paging: false,
            info: false,
            searching: false,
            lengthChange: false,
        }) 
    }).catch(error => console.log(error));

    function renderRow(item){
        const tr = document.createElement("tr");
        tr.dataset.id = item._id;
        tr.innerHTML = `
            <td> ${item._id} </td>
            <td> ${item.name} </td>
            <td> ${item.description} </td>
            <td>
                <button class="btn btn-sm btn-warning btnEdit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger btnDelete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `
        tBody.appendChild(tr)

        tr.querySelector(".btnEdit").addEventListener("click", () => {
            openEditModal(item, tr)
        });
        tr.querySelector(".btnDelete").addEventListener("click", ()=> {
            if(confirm(` Bạn có chắc chắn muốn xóa danh mục ${item.name} không `)) {

                fetch(`${apiUrl}/${item._id}`, {
                    method: "DELETE",
                }).then(res => res.json()).then(() => tr.remove()).catch(error => console.log(error));
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
        $(modal).on("hidden.bs.modal", function () {
            modal.remove();
        });
        return modal;
    }

    addButton.addEventListener("click", () => {
        const formHtml = `
        <form id="categoryForm">
            <div class="form-group">
                <label for="categoryName">Tên danh mục</label>
                <input type="text" class="form-control" id="categoryName" required>
            </div>
            <div class="form-group">
                <label for="categoryDescription">Mô tả</label>
                <input type="text" class="form-control" id="categoryDescription" required>
            </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu danh mục</button>
        </form>
        `;
        const modal = createModal("Thêm danh mục mới", formHtml);

        modal.querySelector("#categoryForm").addEventListener("submit", () => {
            const newCategory = {
                name: document.querySelector("#categoryName").value,
                description: document.querySelector("#categoryDescription").value,
            }
            fetch(apiUrl, {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCategory)
            })
            .then(res => res.json()).then(data =>{
                renderRow(data);
                $(modal).modal("hide");
                modal.remove();
            }).catch(error => console.log(error));
        })
    });

    function openEditModal(item, row) {
        const formHtml = `
        <form id="categoryForm">
            <div class="form-group">
                <label for="categoryName">Tên danh mục</label>
                <input type="text" class="form-control" id="categoryName" value="${item.name}"  required>
            </div>
            <div class="form-group">
                <label for="categoryDescription">Mô tả</label>
                <input type="text" class="form-control" id="categoryDescription" value="${item.description}" required>
            </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu danh mục</button>
        </form>
        `;
        const modal = createModal("Chỉnh sửa danh mục", formHtml);
        modal.querySelector("#categoryForm").addEventListener("submit", () => {
            const updatedCategory = {
                name: document.querySelector("#categoryName").value,
                description: document.querySelector("#categoryDescription").value,
            }
            fetch(`${apiUrl}/${item._id}`, { 
                method: "PUT", 
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCategory)
            })
            .then(res => res.json()).then(data =>{
                row.querySelector("td:nth-child(2)").textContent = updatedCategory.name;
                row.querySelector("td:nth-child(3)").textContent = updatedCategory.description;
                $(modal).modal("hide");
                modal.remove();
            }).catch(error => console.log(error));
        })
    }
}) 