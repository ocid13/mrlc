import React, { useState, useEffect, useRef } from "react";
import { Pagination, Modal, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaInfo } from "react-icons/fa";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import logo from "../../../../assets/img/icon-mrevents.png";
import { formatRupiah } from "../../../../helper/FormaterRupiah";
// import * as XLSX from "xlsx"; // Import XLSX for Excel export
// import { FaFileExcel } from "react-icons/fa"; // Excel icon
import { usePayments } from "../../../../context/PaymentLcmContext";
import { useBranch, useProgram } from "../../../../context/BranchContext";
import { useAuth } from "../../../../context/AuthContext";

const PaymentLcm = () => {
  const { payments, isLoading, error, updatePayment } = usePayments();
  const { branches } = useBranch();
  const { programs } = useProgram();
  const [loadingId, setLoadingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const filterTriggeredRef = useRef(false);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    program: "",
    lokasi: "",
    status: "",
    jenis: "",
  });

  const { user: rawUser } = useAuth();
      
  const user = {
    ...rawUser,
    jobs: typeof rawUser?.jobs === "string"
      ? rawUser.jobs.split(",").map(Number)
      : rawUser?.jobs,
  };
  console.log(branches)

  const handleShow = (payment) => {
    setSelectedPayment(payment);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const sortedPayments = [...filteredPayments].sort(
    (a, b) => new Date(b.date_paid) - new Date(a.date_paid)
  );
  const paginatedPayments = sortedPayments.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setActivePage(pageNumber);
    }
  };

  const handleApprove = (id) => {
    Swal.fire({
      title: "APPROVAL PEMBAYARAN",
      text: "Apakah Anda ingin approve pembayaran?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Approve",
      cancelButtonText: "Batal",
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setLoadingId(id);
        updatePayment.mutate(
          { paymentId: id, newPaymentValue: 1 },
          {
            onSuccess: () => {
              Swal.fire({
                icon: "success",
                title: "Berhasil!",
                text: "Pembayaran berhasil di-approve.",
                timer: 2000,
                showConfirmButton: false,
              });
            },
            onError: () => {
              Swal.fire({
                icon: "error",
                title: "Gagal!",
                text: "Gagal approve pembayaran.",
                timer: 2000,
                showConfirmButton: false,
              });
            },
          }
        );
      }
    });
  };

  // Saat filter berubah, reset ke halaman 1 dan filter ulang data
  useEffect(() => {
    let newFilteredPayments = payments;

    // Semua filter (tidak diubah)
    if (filters.startDate) {
      newFilteredPayments = newFilteredPayments.filter(
        (lead) =>
          lead.date_paid &&
          new Date(lead.date_paid).setHours(0, 0, 0, 0) >=
            new Date(filters.startDate).setHours(0, 0, 0, 0)
      );
    }
    if (filters.endDate) {
      newFilteredPayments = newFilteredPayments.filter(
        (lead) =>
          lead.date_paid &&
          new Date(lead.date_paid).setHours(0, 0, 0, 0) <=
            new Date(filters.endDate).setHours(0, 0, 0, 0)
      );
    }

    if (filters.program && filters.program !== "All") {
      newFilteredPayments = newFilteredPayments.filter((lead) => {
        return lead.children.some((program) => program.program_name === filters.program);
      });
    }

     if (filters.lokasi && filters.lokasi !== "All") {
      newFilteredPayments = newFilteredPayments.filter((lead) => {
        return lead.children.some((lokasi) => lokasi.kode_cabang === filters.lokasi);
      });
    }

    if (filters.status && filters.status !== "All") {
      if (filters.status === "notapp") {
        newFilteredPayments = newFilteredPayments.filter(
          (lead) => lead.status_approve === null
        );
      } else {
        newFilteredPayments = newFilteredPayments.filter(
          (lead) => lead.status_approve === Number(filters.status)
        );
      }
    }
    if (filters.jenis && filters.jenis !== "All") {
      newFilteredPayments = newFilteredPayments.filter((lead) => {
        return lead.children.some((jenis) => jenis.course_name === filters.jenis);
      });
    }

    setFilteredPayments(newFilteredPayments);
    if (filterTriggeredRef.current) {
      setActivePage(1);
      filterTriggeredRef.current = false;
    }
  }, [filters, payments]);

  const handleFilterChange = (e) => {
    filterTriggeredRef.current = true;
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatKapital = (kelas) => {
    return kelas
      .split('_') // pisah berdasarkan underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // kapital tiap kata
      .join(' '); // gabungkan kembali dengan spasi
  };

  // const handleExportToExcel = () => {
  //   const exportData = filteredPayments.map((payment, index) => ({
  //     No: index + 1, // Nomor urut dimulai dari 1
  //     "Tgl Bayar": payment.date_paid
  //       ? new Date(payment.date_paid).toLocaleDateString("id-ID", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         })
  //       : "",
  //     "Order ID": payment.invoice,
  //     Nama: payment.name,
  //     Program:
  //       payment.program_name === "LCm" ? "Life Camp" : payment.program_name,
  //     Jumlah: formatRupiah(payment.total_fix),
  //     Status:
  //       payment.status_approve === null
  //         ? "Belum di Approved"
  //         : payment.status_approve === 1
  //         ? "Approved"
  //         : "Reject",
  //     "Tgl Approve": payment.date_approve
  //       ? new Date(payment.date_approve).toLocaleDateString("id-ID", {
  //           day: "2-digit",
  //           month: "short",
  //           year: "numeric",
  //         })
  //       : "",
  //   }));

  //   const currentDate = new Date();
  //   const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString(
  //     "id-ID",
  //     {
  //       month: "short",
  //     }
  //   )}-${currentDate.getFullYear()}`;

  //   const ws = XLSX.utils.json_to_sheet(exportData);
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Payments");

  //   const fileName = `Payments Life Camp ${formattedDate}.xlsx`;

  //   XLSX.writeFile(wb, fileName);
  // };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">

      {/* Filter */}
      <div className="card mt-1">
        <div className="card-header">
          <h5 className="fs-5 fw-bold">FILTER</h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            {/* Start Date */}
            <div className="col-md-2">
              <label className="form-label">START DATE</label>
              <input
                type="date"
                name="startDate"
                className="form-control"
                onChange={handleFilterChange}
              />
            </div>

            {/* End Date */}
            <div className="col-md-2">
              <label className="form-label">END DATE</label>
              <input
                type="date"
                name="endDate"
                className="form-control"
                onChange={handleFilterChange}
              />
            </div>

            {/* Program */}
            <div className="col-md-2">
              <label className="form-label">PROGRAM</label>
              <select
                name="program"
                className="form-select"
                onChange={handleFilterChange}
              >
                <option>All</option>
                {programs && programs.map((program) => (
                  <option key={program.id} value={program.name}>
                    {program.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="col-md-2">
              <label className="form-label">LOCATION</label>
              <select name="lokasi" className="form-select" onChange={handleFilterChange}>
                <option value="">All</option>
                {user.jobs && user.jobs.length > 0 && Array.isArray(branches) && (
                  <>
                    {(user.jobs[0] === 1
                      ? branches
                      : branches.filter((branch) => user.jobs.includes(branch.id))
                    ).map((branch) => (
                      <option key={branch.id} value={branch.kode_cabang}>
                        {branch.kode_cabang}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Status */}
            <div className="col-md-2">
              <label className="form-label">STATUS</label>
              <select
                name="status"
                className="form-select"
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >
                <option>All</option>
                <option value="notapp">-</option>
                <option value="1">Paid</option>
                <option value="0">Reject</option>
              </select>
            </div>

            {/* Jenis */}
            <div className="col-md-2">
              <label className="form-label">JENIS</label>
              <select
                name="jenis"
                className="form-select"
                onChange={(e) =>
                  setFilters({ ...filters, jenis: e.target.value })
                }
              >
                <option>All</option>
                {/* <option value="notapp">-</option> */}
                <option value="Modul">Modul</option>
                <option value="Full Program">Full Program</option>
              </select>
            </div>
          </div>
          {/* Tombol Filter */}
          <button className="btn btn-primary mt-3">Filter</button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fs-5 fw-bold">LIST PEMBAYARAN</h5>
          {/* <button
            className="btn btn-success mt-3"
            onClick={handleExportToExcel}
          >
            <FaFileExcel size={20} />
          </button> */}
        </div>
        <div className="card-body px-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tgl Bayar</th>
                  <th>ORDER ID</th>
                  <th>Nama</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                  <th>Tgl Approve</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Loading & Error Handling */}
                {isLoading && <tr><td colSpan={10}><motion.img
                    src={logo}
                    alt="Loading..."
                    width={40}
                    animate={{ rotate: 180 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                /></td></tr>}
                {error && <tr><td colSpan={10}><p className="text-danger">Error: {error}</p></td></tr>}

                {paginatedPayments.length > 0 ? (
                  paginatedPayments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {payment.date_paid ? new Date(payment.date_paid).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })
                        : ""}
                      </td>
                      <td>{payment.invoice}</td>
                      <td>
                        <Link to="#" className="btn btn-link" onClick={() => handleShow(payment)}>
                          {payment.name}
                        </Link>
                      </td>
                      <td>{formatRupiah(payment.total_fix)}</td>
                      <td>
                        {(() => {
                            switch (payment.status_approve) {
                            case null:
                                return "-";
                            case 1:
                                return "Paid";
                            case 0:
                                return "Reject";
                            default:
                                return null;
                            }
                        })()}
                      </td>
                      <td>
                        {payment.date_approve
                        ? new Date(payment.date_approve).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })
                        : ""}
                      </td>
                      <td>
                        {payment.status_approve === null && (
                          <button
                            className="btn btn-sm me-2 btn-warning"
                            onClick={() => handleApprove(payment.id_payment)}
                            disabled={loadingId === payment.id_payment}
                          >
                            {loadingId === payment.id_payment ? (
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            ) : (
                              <FaInfo />
                            )}
                          </button>
                        )}

                        {payment.status_approve === 1 && (
                          <>
                            <button
                              className="btn btn-sm me-2 btn-success"
                              disabled
                            >
                              <FaCheck />
                            </button>
                          </>
                        )}

                        {payment.status_approve === 0 && (
                          <>
                            <button className="btn btn-danger btn-sm" disabled>
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="10">No data available</td>
                    </tr>
                )}
                    
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination className="justify-content-end mt-3 me-3">
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={activePage === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
            />

            {/* Menentukan halaman yang akan ditampilkan */}
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;

              // Tentukan rentang halaman yang akan ditampilkan: 2 halaman sebelumnya dan 2 halaman setelahnya
              if (
                pageNumber >= activePage - 2 &&
                pageNumber <= activePage + 2 &&
                pageNumber <= totalPages
              ) {
                return (
                  <Pagination.Item
                    key={pageNumber}
                    active={pageNumber === activePage}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                );
              }
              return null;
            })}

            <Pagination.Next
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
            />
            <Pagination.Last
              onClick={() => handlePageChange(totalPages)}
              disabled={activePage === totalPages}
            />
          </Pagination>
        </div>
      </div>

      {/* Modal Detail */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header>
          <Modal.Title>DETAIL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment ? (
            <>
              <div className="row">
                {/* Kiri: Detail Pembayaran */}
                <div className="col-md-6 text-center">
                  <img
                    src={selectedPayment.gambar}
                    alt="Bukti Pembayaran"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "250px",
                      objectFit: "contain",
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}
                  />
                </div>

                {/* Kanan: Bukti Pembayaran */}
                <div className="col-md-6">
                  <p>
                    <strong>ORDER ID:</strong> {selectedPayment.invoice}
                  </p>
                  <p>
                    <strong>Tanggal Bayar: </strong> 
                    {selectedPayment.date_paid ? new Date(selectedPayment.date_paid).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric"
                    }) : ""}
                  </p>
                  <p>
                    <strong>Tipe Pembayaran:</strong>{' '}
                    {selectedPayment.link_bayar !== null ? 'Online Payment' : 'Offline Payment'}
                  </p>
                  <p>
                    <strong>Jenis Pembayaran:</strong> {selectedPayment.link_bayar !== null ? 'Xendit' : formatKapital(selectedPayment.payment_method)}
                  </p>

                  {/* Tampilkan hanya jika Offline Payment */}
                  {selectedPayment.link_bayar === null && (
                    <>
                      {/* Jika bukan Cash, tampilkan Bank dan Nama Pemilik Kartu */}
                      {selectedPayment.payment_method !== 'cash' && (
                        <>
                          <p>
                            <strong>Bank:</strong> {selectedPayment.nama_bank}
                          </p>
                          <p>
                            <strong>Nama Pemilik Kartu:</strong> {selectedPayment.nama_kartu}
                          </p>
                        </>
                      )}

                      {/* Tampilkan Cicilan hanya jika jenis pembayaran adalah Cicilan */}
                      {selectedPayment.payment_method === 'cicilan_bank' && (
                        <p>
                          <strong>Cicilan:</strong> {selectedPayment.bulan_cicilan} Bulan
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Tabel di bawah */}
              <div className="table-responsive mt-4">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Program</th>
                      <th>Location</th>
                      <th>Student</th>
                      <th>Jenis</th>
                      <th>Harga</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {selectedPayment.children && selectedPayment.children.length > 0 ? (
                      selectedPayment.children.map((child, index) => (
                        <tr key={child.children}>
                            <td>{index + 1}</td>
                            <td>{child.program_name}</td>
                            <td>{child.kode_cabang}</td>
                            <td>{child.nama_murid}</td>
                            <td>
                              {selectedPayment.id_program === 6
                              ? child.tipe?.charAt(0).toUpperCase() + child.tipe?.slice(1)
                              : child.course_name}
                            </td>
                            <td>{formatRupiah(child.price)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                          <td colSpan="4">No children data available</td>
                      </tr>
                    )}
                    <tr>
                      <td colSpan={5}><strong>SUBTOTAL</strong></td>
                      <td><strong>{formatRupiah(selectedPayment.children.reduce((sum, child) => sum + child.price, 0))}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={5}><strong>DISCOUNT</strong></td>
                      <td><strong>{formatRupiah(selectedPayment.children.reduce((sum, child) => sum + child.price, 0) - selectedPayment.total_fix)}</strong></td>
                    </tr>
                    <tr>
                      <td colSpan={5}><strong>TOTAL</strong></td>
                      <td><strong>{formatRupiah(selectedPayment.total_fix)}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
              <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentLcm;
