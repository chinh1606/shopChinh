document.addEventListener("DOMContentLoaded", () => {
    const tBody = document.querySelector("#userTable tbody");
    const apiUrl = "http://localhost:3001/api/users";
    const addButton = document.querySelector("#btnAddUser");

    fetch(apiUrl).then(res => res.json()).then(data => {
        data.forEach(item => renderRow(item));
        new DataTable("#userTable", {
            paging: false,
            info: false,
            searching: false,
            lengthChange: false,
        })
    }).catch(error => console.log(error));

    function renderRow(item) {
        const tr = document.createElement("tr");
        tr.dataset.id = item._id;
        tr.innerHTML =  `
        <td> ${item._id} </td>
        <td> ${item.username} </td>
        <td> ${item.email} </td>
        <td> ${item.phone} </td>
        <td> ${item.address} </td>
        <td> ${item.role} </td>
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

        tr.querySelector(".btnEdit").addEventListener("click", ()=> {
            openEditModal(item,tr)
        });
        tr.querySelector(".btnDelete").addEventListener("click", ()=> {
            if(confirm(` Bạn có chắc muốn xóa người dùng ${item.username} không `)) {

                fetch(`${apiUrl}/${item._id}`, {
                    method: "DELETE",
                }).then(res => res.json()).then(()=> tr.remove()).catch(error => console.log(error));
            }
        });
    }

    function createModal(title, body) {
        const modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.innerHTML = `
        <div class="modal-dialog>
            <div class="modal-content>
                <div class="modal-header>
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
        $(modal).on("hidden.bs.modal", function() {
            modal.remove();
        });
        return modal;
    }

    addButton.addEventListener("click", () => {
        const formHtml = `
        <form id="userForm">
            <div class="form-group">
                <label for="userName">Tên </label>
                <input type="text" class="form-control" id="userName" required>
            </div>
            <div class="form-group">
                <label for="userEmail">Địa chỉ email</label>
                <input type="text" class="form-control" id="userEmail" required>
            </div>
            <div class="form-group">
                <label for="userPassword">Mật khẩu</label>
                <input type="text" class="form-control" id="userPassword" required>
            </div>
            <div class="form-group">
                <label for="userPhone">Số điện thoại</label>
                <input type="text" class="form-control" id="userPhone" required>
            </div>
            <div class="form-group">
                <label for="userAddress">Địa chỉ</label>
                <input type="text" class="form-control" id="userAddress" required>
            </div>
            <div class="form-group">
                <label for="userRole">Quyền</label>
                <input type="text" class="form-control" id="userRole" required>
            </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu tên người dùng</button>
        </form>
        `;
        const modal = createModal("Thêm người dùng mới ", formHtml);

        modal.querySelector("#userForm").addEventListener("submit", (e) => {
            e.preventDefault();
            const newUser = {
                username: document.querySelector("#userName").value,
                email: document.querySelector("#userEmail").value,
                password: document.querySelector("#userPassword").value,
                phone: document.querySelector("#userPhone").value,
                address: document.querySelector("#userAddress").value,
                role: document.querySelector("#userRole").value,
            }
            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser)
            })
            .then(res => res.json()).then(data => {
                renderRow(data);
                $(modal).modal("hide");
                modal.remove();
            }).catch(error => console.log(error));
        });     
    })

    function openEditModal(item, row) {
        const formHtml =`
        <form id="userForm">
            <div class="form-group">
                <label for="userName">Tên </label>
                <input type="text" class="form-control" id="userName" value="${item.username}" required>
            </div>
            <div class="form-group">
                <label for="userEmail">Địa chỉ email</label>
                <input type="text" class="form-control" id="userEmail" value="${item.email}" required>
            </div>
            <div class="form-group">
                <label for="userPassword">Mật khẩu</label>
                <input type="text" class="form-control" id="userPassword" value="${item.password}" required>
            </div>
            <div class="form-group">
                <label for="userPhone">Số điện thoại</label>
                <input type="text" class="form-control" id="userPhone" value="${item.phone}" required>
            </div>
            <div class="form-group">
                <label for="userAddress">Địa chỉ</label>
                <input type="text" class="form-control" id="userAddress" value="${item.address}" required>
            </div>
            <div class="form-group">
                <label for="userRole">Quyền</label>
                <input type="text" class="form-control" id="userRole" value="${item.role}" required>
            </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu người dùng</button>
        </form>
        `;
        const modal = createModal("Chỉnh sửa người dùng", formHtml);
        modal.querySelector("#userForm").addEventListener("submit", () => {
            const updateUser = {
                username:document.querySelector("#userName").value,
                email: document.querySelector("#userEmail").value,
                password: document.querySelector("#userPassword").value,
                phone: document.querySelector("#userPhone").value,
                address: document.querySelector("#userAddress").value,
                role: document.querySelector("#userRole").value,
            }
            fetch(`${apiUrl}/${item._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updateUser)
            })
            .then(res => res.json()).then(data => {
                row.querySelector("td:nth-child(2)").textContent=updateUser.username;
                row.querySelector("td:nth-child(3)").textContent=updateUser.email;
                row.querySelector("td:nth-child(4)").textContent=updateUser.phone;
                row.querySelector("td:nth-child(2)").textContent=updateUser.address;
                row.querySelector("td:nth-child(2)").textContent=updateUser.role;
                $(modal).modal("hide");
                modal.remove();
            }).catch(error => console.log(error));
        })
    }
})