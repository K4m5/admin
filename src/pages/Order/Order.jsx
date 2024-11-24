import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelOrder,
  fetchOrder,
  updateOrderStatus,
} from "../../features/order/orderSlice";

const Order = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);
  const currentPage = useSelector((state) => state.orders.currentPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderStatuses, setOrderStatuses] = useState({});

  useEffect(() => {
    dispatch(fetchOrder({ page: currentPage, limit: 10 }));
  }, [currentPage, dispatch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filterOrder = orders.filter((item) => item?.code.includes(searchQuery));

  const handleStatusChange = (orderId, newStatus) => {
    setOrderStatuses((prevStatuses) => ({
      ...prevStatuses,
      [orderId]: newStatus,
    }));
  };

  const handleStatusUpdate = async (orderId) => {
    const newStatus = orderStatuses[orderId];
    if (!newStatus) return;

    try {
      if (newStatus === "Cancelled") {
        dispatch(cancelOrder({ orderId }));
        return;
      }
      dispatch(updateOrderStatus({ orderId, status: newStatus }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container-fluid pt-2">
        <div className="row">
          <div className="col-12">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Đơn hàng</h3>
                <div className="card-tools">
                  <div
                    className="input-group input-group-sm"
                    style={{ width: "200px" }}
                  >
                    <input
                      type="text"
                      placeholder="Tìm kiếm"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="form-control float-right"
                    />
                    <div className="input-group-append">
                      <button type="submit" className="btn btn-default">
                        <i className="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Người dùng</th>
                        <th>Số điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterOrder.map((order) => (
                        <tr key={order._id}>
                          <td>{order?.code}</td>
                          <td>{order?.user?.fullname}</td>
                          <td>{order?.phone}</td>
                          <td>
                            <select
                              className="form-control "
                              value={orderStatuses[order?._id] || order?.status}
                              onChange={(e) =>
                                handleStatusChange(order?._id, e.target.value)
                              }
                            >
                              <option value="Pending">Đang duyệt</option>
                              <option value="Processing">Đang xử lý</option>
                              <option value="Cancelled">Đã hủy</option>
                              <option value="Completed">Hoàn thành</option>
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              onClick={() => handleStatusUpdate(order?._id)}
                            >
                              Sửa
                            </button>
                            {/* chi tiết đơn hàng */}
                            <a
                              href={`/order/${order?._id}`}
                              className="btn btn-info ml-2"
                            >
                              Chi tiết
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
