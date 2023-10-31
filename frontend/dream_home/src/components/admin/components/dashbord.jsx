import React, { useEffect, useState } from "react";
import { Pie, Line } from "react-chartjs-2";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import axiosInstance from "../../../axios/adminaxios";
import "./dashbord.css";

function Dashbord() {
  Chart.register(CategoryScale);

  const [salesByMonth, setSalesByMonth] = useState([]);
  const [totalSale,setTotalSale]=useState(0)
  const [user,setUser]=useState(0)

  useEffect(() => {
    let fetchDetails = async () => {
      let res = await axiosInstance.get("/getDashboardDetails");
      setSalesByMonth(res.data.formattedData);
      setTotalSale(res.data.yearSale)
      setUser(res.data.totalUsers?.length)
    };
    fetchDetails();
  }, []);

  //BAR CHART CONFIGURATION
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Monthly Sales",
        data: salesByMonth.map((item) => item.totalAmount),
      },
    ],
  };

  const options = {
    title: {
      display: true,
      text: "Monthly Bookings Bar Chart",
    },
  };

  //PIE CHART CONFIGURATION
  // const pieData = {
  //   labels: ["Users", "Doctors", "Bookings"],
  //   datasets: [
  //     {
  //       data: [details.totalUsers, details.totalDoctors, details.totalBookings],
  //       backgroundColor: ["red", "green", "blue"],
  //     },
  //   ],
  // };

  // const pieOptions = {
  //   title: {
  //     display: true,
  //     text: "Pie Chart",
  //   },
  // };

  return (
    <section className="container">
      <div className="flex justify-between p-16 mt-6">
      <div >
        <div class="card">
          <div class="card-content">
            <p class="card-title">Total Users</p>
            <p class="card-para">
              {user}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-content">
            <p class="card-title">Total Sales</p>
            <p class="card-para">
            ₹ {totalSale}
            </p>
          </div>
        </div>
      </div>
      <div >
        <div class="card">
          <div class="card-content">
            <p class="card-title">Current year Sales</p>
            <p class="card-para">
            ₹{totalSale}
            </p>
          </div>
        </div>
      </div></div>
      <div className="md:flex px-12 md:h-1/2 md:justify-between ">
        <div className="md:w-full md:p-5">
          <Line data={data} options={options} />
        </div>
        {/* <div className="md:w-1/3 p-5">
          <Pie data={pieData} options={pieOptions} />
        </div> */}
      </div>
    </section>
  );
}

export default Dashbord;
