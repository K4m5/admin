import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentOrderCount } from "../../features/statistic/currentOrderSlice";
import { fetchCurrentRevenue } from "../../features/statistic/currentRevenueSlice";
import { fetchMonthlyOrderCount } from "../../features/statistic/monthlyOrderSlice";
import { fetchMonthlyRevenue } from "../../features/statistic/monthlyRevenueSlice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Home = () => {
  const [orderData, setOrderData] = useState([]);
  const [foodData, setFoodData] = useState([]);
  const dispatch = useDispatch();
  const monthlyRevenue = useSelector((state) => state.monthlyRevenue);
  const monthlyOrder = useSelector((state) => state.monthlyOrder);
  const currentRevenue = useSelector((state) => state.currentRevenue);
  const currentOrder = useSelector((state) => state.currentOrder);

  useEffect(() => {
    dispatch(fetchMonthlyRevenue());
    dispatch(fetchMonthlyOrderCount());
    dispatch(fetchCurrentRevenue());
    dispatch(fetchCurrentOrderCount());
  }, [dispatch]);

  const revenueChartData = {
    labels: monthlyRevenue.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Doanh thu (VND)',
        data: monthlyRevenue.map((item) => item.totalRevenue),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu biểu đồ số lượng đơn hàng
  const orderChartData = {
    labels: monthlyOrder.map((item) => `Tháng ${item.month}`),
    datasets: [
      {
        label: 'Số lượng đơn hàng',
        data: monthlyOrder.map((item) => item.orderCount),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container pt-2">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-2">Doanh thu đơn hàng</h5>
              <p className="card-text">
                Hàng ngày: {currentRevenue.dailyRevenue || 0}
              </p>
              <p className="card-text">
                Hàng tuần: {currentRevenue.weeklyRevenue || 0}
              </p>
              <p className="card-text">
                Hàng tháng: {currentRevenue.monthlyRevenue || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-2">Số lượng đơn hàng</h5>
              <p className="card-text">
                Hàng ngày: {currentOrder.dailyOrders || 0}
              </p>
              <p className="card-text">
                Hàng tuần: {currentOrder.weeklyOrders || 0}
              </p>
              <p className="card-text">
                Hàng tháng: {currentOrder.monthlyOrders || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6">
          <h2>Doanh thu đơn hàng</h2>
          <Bar data={revenueChartData} options={chartOptions} />
        </div>
        <div className="col-md-6">
          <h2>Số lượng đơn hàng          </h2>
          <Bar data={orderChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Home;
