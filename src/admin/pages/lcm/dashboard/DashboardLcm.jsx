import React, { useState } from "react";
import { MdOutlineCancel, MdPaid } from "react-icons/md";
import { LuClock3 } from "react-icons/lu";
import Chart from "react-apexcharts";
import { FaHourglassHalf } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
// import { formatRupiah } from "../../../../helper/FormaterRupiah";
import Tippy from "@tippyjs/react";
import { FaInfoCircle } from "react-icons/fa";
import "tippy.js/dist/tippy.css";
import { useDashboardLcm } from "../../../../context/DashboardLcmContext";
// import { useAuth } from "../../../../context/AuthContext";

const DashboardLcm = () => {
  const {daysLcm, pendingLcm, expiredLcm, paidLcm, ytdLcm, pendingYtdLcm, expiredYtdLcm, paidYtdLcm, totalLcm,
          totalMonthLcm, grafikStudentLcm, grafikRevenueLcm, studentY, studentM, sourceLcm, waitTodayLcm,
          waitYearLcm, isAnyLoading, error, refetch, isRevenueYLoading, isRevenueMLoading} = useDashboardLcm();
  const [activeTab, setActiveTab] = useState("all-time");
  const selectedRevenueLcm = activeTab === "monthly" ? totalMonthLcm : totalLcm;
  const selectedTotalLcm = activeTab === "monthly" ? studentM : studentY;

  // const { user: rawUser } = useAuth();
  
    // const user = {
    //   ...rawUser,
    //   jobs: typeof rawUser?.jobs === "string"
    //     ? rawUser.jobs.split(",").map(Number)
    //     : rawUser?.jobs,
    // };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const CARD_TODAY = [
    { title: "Total Sign Up", count: daysLcm?.user_count ?? '-' },
    { title: "Pending", count: pendingLcm?.count ?? '-' },
    { title: "Expired", count: expiredLcm?.count ?? '-' },
    { title: "Paid", count: paidLcm?.count ?? '-' },
    { title: "Waiting Approval", count: waitTodayLcm?.count ?? '-' },
  ];

  const CARD_YTD = [
    {
      icon: <FaUser className="text-white" style={{ fontSize: "28px" }} />,
      title: "Total Sign Up",
      count: ytdLcm?.user_count ?? "-",
      bgColor: "bg-primary",
      content: "Total yang sudah selesai mengisi form dan submit",
    },
    {
      icon: <LuClock3 className="text-white" style={{ fontSize: "28px" }} />,
      title: "Pending",
      count: pendingYtdLcm?.count ?? "-",
      bgColor: "bg-warning",
      content: "Total data yang belum melakukan pembayaran",
    },
    {
      icon: <MdOutlineCancel className="text-white" style={{ fontSize: "28px" }} />,
      title: "Expired",
      count: expiredYtdLcm?.count ?? "-",
      bgColor: "bg-danger",
      content: "Total data yang link pembayarannya sudah expired",
    },
    {
      icon: <MdPaid className="text-white" style={{ fontSize: "28px" }} />,
      title: "Paid",
      count: paidYtdLcm?.count ?? "-",
      bgColor: "bg-success",
      content:
        "Total data yang sudah melakukan pembayaran dan sudah diapprove oleh finance",
    },
    {
      icon: <FaHourglassHalf className="text-white" style={{ fontSize: "28px" }} />,
      title: "Waiting Approval",
      count: waitYearLcm?.count ?? "-",
      bgColor: "bg-info",
      content:
      "Total data yang sudah melakukan pembayaran namun belum diapprove oleh finance",
    },
  ];

  const CardYtd = ({ card }) => (
    <div className="col">
      <div className={`card text-center shadow-sm text-white ${card.bgColor}`}>
        <div className="card-body position-relative">
          <Tippy
            content={card.content}
            placement="top-end"
            style={{
              backgroundColor: "white", // Warna latar belakang putih
              color: "black", // Warna teks hitam
              border: "1px solid #ccc", // Menambahkan border abu-abu
              padding: "5px 10px", // Menambahkan padding untuk menambah ruang
              borderRadius: "4px", // Membuat border sedikit melengkung
              fontSize: "14px", // Ukuran font
            }}
          >
            <button
              className="position-absolute top-0 end-0 m-2"
              style={{
                background: "transparent",
                border: "none",
                color: "white",
              }}
            >
              <FaInfoCircle size={20} />{" "}
              {/* Menampilkan ikon di dalam tombol */}
            </button>
          </Tippy>
          <div className="mb-2">{card.icon}</div>
          <h6 className="card-title mb-1">{card.title}</h6>
          <p className="card-text fs-5 fw-bold text-white">{card.count}</p>
        </div>
      </div>
    </div>
  );

  const CardToday = ({ title, count }) => (
    <div className="col-auto">
      <div
        className="card shadow-sm"
        style={{ width: "200px", height: "50px" }}
      >
        <div className="card-body d-flex justify-content-between align-items-center p-2">
          <h6 className="card-title mb-0">{title}</h6>
          <h6 className="card-text fs-5 fw-bold">{count}</h6>
        </div>
      </div>
    </div>
  );

  // Grafik Student
  const optionsStudent = {
    chart: {
      type: "bar",
      height: 300,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: grafikStudentLcm?.labels ?? [], // dynamic dari API
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };

  const seriesStudent = [
    {
      name: "Jumlah Student",
      data: grafikStudentLcm?.series?.[0] ?? [],
    },
  ]; // dynamic dari API

  // Grafik Revenue
  const optionRevenue = {
    chart: {
      type: "bar",
      height: 300,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val);
      },
      style: {
        fontSize: "10px",
        fontWeight: "bold",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: grafikRevenueLcm?.labels ?? [],
    },
    yaxis: {
      labels: {
        formatter: (value) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(value),
      },
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };

  const seriesRevenue = [
    {
      name: "Revenue",
      data: grafikRevenueLcm?.series?.[0] ?? [],
    },
  ];

  if (isAnyLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    // Today
    <div className="container-xxl flex-grow-1 container-p-y">
      <div className="row g-2">
        <div className="row g-3">
          <div className="h5 font-weight-bold text-dark">TODAY</div>
          {CARD_TODAY.map((card, index) => (
            <CardToday key={index} title={card.title} count={card.count} />
          ))}
        </div>

        {/* YTD */}
        <div className="row g-3">
          <div className="h5 font-weight-bold text-dark mb-4">YTD</div>
          {CARD_YTD.map((card) => (
            <CardYtd key={card.id} card={card} />
          ))}
        </div>

        <div className="row g-3">
          {/* Total Revenue */}
          <div className="col-md-6 col-lg-4 col-xl-6 order-0 mb-4">
            <div className="card" style={{ height: "550px" }}>
              <div className="card-header d-flex justify-content-center py-2">
                <div className="card-title mb-0">
                  <h5 className="mb-3 mt-3 fs-5 fw-bold mb-4">TOTAL REVENUE</h5>
                  <ul className="nav nav-pills mb-4" role="tablist">
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${activeTab === "all-time" ? "active" : ""}`}
                        role="tab"
                        onClick={() => handleTabClick("all-time")}
                      >
                        Yearly
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${activeTab === "monthly" ? "active" : ""}`}
                        role="tab"
                        onClick={() => handleTabClick("monthly")}
                      >
                        Monthly
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body d-flex flex-column">
                <h3 className="text-center mb-4">
                  {activeTab === "all-time"
                  ? (isRevenueYLoading ? "Loading..." : totalLcm?.total?.total_revenue)
                  : (isRevenueMLoading ? "Loading..." : totalMonthLcm?.total?.total_revenue)}
                </h3>
                <div className="flex-grow-1 d-flex flex-column">
                  <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: '280px' }}>
                    <table className="table table-striped mb-0">
                      <thead className="text-center">
                        <tr>
                          <th>No</th>
                          <th>Location</th>
                          <th>Student</th>
                          <th>Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {(selectedRevenueLcm?.data || []).map((item, index) => (
                          <tr key={index}>
                            <td>{item.no}</td>
                            <td>{item.location}</td>
                            <td>{item.student}</td>
                            <td>{item.revenue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <table className="table table-striped mt-2">
                    <tbody className="text-center">
                      <tr>
                        <td><strong>TOTAL</strong></td>
                        <td></td>
                        <td></td>
                        <td><strong>{selectedRevenueLcm?.total?.total_revenue}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Total Student */}
          <div className="col-md-6 col-lg-4 col-xl-6 order-0 mb-4">
            <div className="card mb-2" style={{ height: "550px" }}>
              <div className="card-header d-flex justify-content-center py-2 mb-5">
                <div className="card-title mb-3">
                  <h5 className="mb-3 mt-3 fs-5 fw-bold">TOTAL STUDENT</h5>
                  <ul className="nav nav-pills mb-4" role="tablist">
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${
                          activeTab === "all-time" ? "active" : ""
                        }`}
                        role="tab"
                        onClick={() => handleTabClick("all-time")}
                      >
                        Yearly
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        type="button"
                        className={`nav-link ${
                          activeTab === "monthly" ? "active" : ""
                        }`}
                        role="tab"
                        onClick={() => handleTabClick("monthly")}
                      >
                        Monthly
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive" style={{ overflowY: 'auto', maxHeight: '280px' }}>
                  <table className="table table-striped">
                    <thead className="text-center">
                      <tr>
                        <th>No</th>
                        <th>Program</th>
                        <th>Student</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                        {selectedTotalLcm?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.program}</td>
                            <td>{item.student_count}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-responsive">
                  <table className="table table-striped mt-2">
                    <tbody className="text-center">
                      <tr>
                        <td><strong>TOTAL</strong></td>
                        <td></td>
                        <td></td>
                        <td><strong>{selectedTotalLcm?.total?.total_student ?? '-'}</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Grafik Revenue */}
          <div className="col-md-6 col-lg-4 col-xl-6 order-0 mb-4">
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title fs-5 fw-bold">GRAFIK REVENUE</h5>
                <div id="chartatas">
                  <Chart
                    options={optionRevenue}
                    series={seriesRevenue}
                    type="bar"
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Grafik Student */}
          <div className="col-md-6 col-lg-4 col-xl-6 order-0 mb-4">
            <div className="card mb-2">
              <div className="card-body">
                <h5 className="card-title fs-5 fw-bold">GRAFIK STUDENT</h5>
                <div id="chartatas">
                  <Chart
                    options={optionsStudent}
                    series={seriesStudent}
                    type="bar"
                    height={300}
                  />
                </div>
              </div>
            </div>
          </div>
          

          {/* Source */}
          {/* <div className="col-md-6 col-lg-4 col-xl-6 order-0 mb-4">
            <div
              className="card"
              style={{ height: "600px", display: "flex", flexDirection: "column", }}
            >

              <div className="card-header d-flex justify-content-between py-2">
                <h5 className="mb-3 mt-3 fs-5 fw-bold">SOURCE</h5>
              </div>

              <div className="card-body" style={{ flex: 1, overflowY: "auto" }}>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="text-center">
                      <tr>
                        <th rowSpan="2" className="align-middle text-center">Source</th>
                        <th colSpan="2" className="text-center">Jumlah</th>
                        <th rowSpan="2" className="align-middle text-center">Total</th>
                      </tr>
                      <tr>
                        <th>Prospect</th>
                        <th>Customer</th>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      
                        <tr>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      
                      <br />
                      <tr>
                        <th><strong>TOTAL</strong></th>
                        <td><strong></strong></td>
                        <td><strong></strong></td>
                        <td><strong></strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardLcm;
