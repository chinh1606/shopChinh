document.addEventListener("DOMContentLoaded", () => {     // ghi nhận sự kiện khi toàn bộ tài liệu HTML chạy xong 
    const tBody = document.querySelector("#newsTable tbody");
    const apiUrl = "http://localhost:3001/api/news";
    const addButton = document.querySelector("#btnAddNews"); 
    
    fetch(apiUrl).then(res => res.json()).then(data => {
        data.forEach(item => renderRow(item));
        new DataTable("#newsTable", {
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
            <td> ${item.title} </td>
            <td> ${item.user_id.username} </td>
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
            if(confirm(` Bạn có chắc chắn muốn xóa tin tức ${item.title} không `)) {

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
        <form id="newsForm">
            <div class="form-group">
                <label for="newsTitle">Tên tiêu đề tin tức</label>
                <input type="text" class="form-control" id="newsTitle" required>
            </div>
            <div class="form-group">
                <label for="newsContent">Nội dung</label>
                <textarea class="form-control" id="newsContent" name="newsContent" required></textarea>
            </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu tin tức</button>
        </form>
        `;
       
        const modal = createModal("Thêm tin tức mới", formHtml);
        $(modal).on('shown.bs.modal', function () {
            CKEDITOR.replace('newsContent', {
                height: 200,
                width: '100%',
                toolbar: [
                    { name: 'basic', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
                    { name: 'links', items: ['Link', 'Unlink'] },
                    { name: 'tools', items: ['Maximize'] }
                ]
            });
        });

        $(modal).on('hidden.bs.modal', function () {
            if (CKEDITOR.instances['newsContent']) {
                CKEDITOR.instances['newsContent'].destroy();
            }
        });

        modal.querySelector("#newsForm").addEventListener("submit", async() => {
            const newNews = {
                title: document.querySelector("#newsTitle").value,
                content: CKEDITOR.instances['newsContent'].getData(),
                user_id: "67debf549f42ceacd6d58565",
            }
            
            try {
                await fetch(apiUrl, {
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newNews)
                })
                .then(res => res.json()).then(data =>{
                    renderRow(data);
                    $(modal).modal("hide");
                    modal.remove();
                }).catch(error => console.log(error));
            } catch (error) {
                console.log(error)
            }
        
        })
    });

    function openEditModal(item, row) {
        const formHtml = `
        <form id="newsForm">
            <div class="form-group">
                <label for="newsTitle">Tiêu đề</label>
                <input type="text" class="form-control" id="newsTitle" value="${item.title}"  required>
            </div>
            <div class="form-group">
                <label for="newsContent">Nội dung</label>
                <textarea class="form-control" id="newsContent" name="newsContent"  required></textarea>
            </div>
                <button type="submit" class="btn btn-primary mt-3">Lưu tin tức</button>
        </form>
        `;
        const modal = createModal("Chỉnh sửa tin tức", formHtml);
        $(modal).on('shown.bs.modal', function () {
            if (CKEDITOR.instances['newsContent']) {
                CKEDITOR.instances['newsContent'].destroy();
            }
            CKEDITOR.replace('newsContent', {
                height: 200,
                width: '100%',
                toolbar: [
                    { name: 'basic', items: ['Bold', 'Italic', 'Underline', 'Strike', '-', 'RemoveFormat'] },
                    { name: 'paragraph', items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent'] },
                    { name: 'links', items: ['Link', 'Unlink'] },
                    { name: 'tools', items: ['Maximize'] }
                ]
            });
            
            CKEDITOR.replace("newsContent");
            CKEDITOR.instances['newsContent'].setData(item.content);
        });

        $(modal).on('hidden.bs.modal', function () {
            if (CKEDITOR.instances['newsContent']) {
                CKEDITOR.instances['newsContent'].destroy();
            }
        });
        modal.querySelector("#newsForm").addEventListener("submit", async(e) => {
            e.preventDefault();
            e.stopPropagation();
            const updatedNews = {
                title: document.querySelector("#newsTitle").value,
                content: CKEDITOR.instances['newsContent'].getData(),
                user_id: "67debf549f42ceacd6d58565",
            }
            try {
                await fetch(`${apiUrl}/${item._id}`, { 
                    method: "PUT", 
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedNews)
                })
                .then(res => res.json()).then(data =>{
                    row.querySelector("td:nth-child(2)").textContent = updatedNews.title;
                    $(modal).modal("hide");
                    modal.remove();
                }).catch(error => console.log(error));
            } catch (error) {
                console.log(error);
            }
        })
    }
}) 