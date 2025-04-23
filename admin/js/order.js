
document.addEventListener("DOMContentLoaded", () => {
    const tBody = document.querySelector('#orderTable tbody');
    const apiUrl = "http://localhost:3001/api/orders";

    fetch(apiUrl).then(res => res.json()).then(data => {
        data.forEach(item => renderRow(item));
        new DataTable("#orderTable", {
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
            <td> ${item.user_id.username} </td>
            <td> ${item.order_date} </td>
            <td> ${item.total_amount} </td>
            <td> ${item.shipping_address} </td>
            <td> ${item.payment} </td>
            <td> 
                ${
                item.status === "pending"
                    ? "Chờ xử lý " 
                    : item.status === "shipped"
                    ? "Đang giao hàng"
                    : "Đã giao hàng"
                } 
            </td>

            <button class="btn btn-sm btn-danger btnView">
                <i class="fas fa-eye"></i>
            </button>
        `

        tBody.appendChild(tr)

        tr.querySelector(".btnView").addEventListener("click", () => {
            openViewModal(item)
        });
    }

    function openViewModal(item) {
        const productsList = item.products.map(product => {
            return `
                <tr> 
                    <td> ${product.product_id._id} </td>
                    <td> ${product.name} </td>
                    <td> ${product.quantity} </td>
                    <td> ${product.price} </td>
                </tr>
            `
        }).join("")

        const modalView = `
            <div> 
                <h3> Thông tin đơn hàng: ${item._id} </h3>
                <p> Tên khách hàng: ${item.user_id.username} </p>
                <p> Địa chỉ khách hàng: ${item.user_id.address} </p>
                <p> Email khách hàng: ${item.user_id.email} </p>
                <p> Ngày đạt hàng: ${item.order_date} </p>
                <p> Tổng giá tiền: ${item.total_amount} </p>
                <p> Trạng thái: ${item.status} </p>
                <p> Địa chỉ giao hàng: ${item.shipping_address} </p>
                <p> Phương thức thanh toán: ${item.payment} </p>
                <h5> Sản phẩm: </h5>
                <table class="table table-hover table-borderd">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Tên sản phẩm</th>
                            <th>Số lượng</th>
                            <th>Giá</th>
                        </tr>
                    </thead> 
                        <tbody>
                            ${productsList}
                        </tbody>  
                    </table>
            </div>
        `
        const modal = document.createElement("div");
        modal.classList.add("modal", "fade");
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Chi tiết đơn hàng</h5>
                <button type="button" class="close" data-dismiss="modal">
                <span>×</span>
                </button>
            </div>
            <div class="modal-body">
                ${modalView}
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



});

