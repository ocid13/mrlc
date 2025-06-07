import React, { useState, useEffect } from "react";
import { Modal, Button, Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../../assets/img/icon-mrevents.png";
import { formatRupiah } from "../../../../helper/FormaterRupiah";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { FaFileExcel } from "react-icons/fa";
import { useCustomers } from "../../../../context/CustomerLcmContext";
import { useBranch, useProgram } from "../../../../context/BranchContext";
import { useAuth } from "../../../../context/AuthContext";

const DaftarCustomerLcm = () => {
  const { customers, isLoading, error } = useCustomers();
  const { branches } = useBranch();
  const { programs } = useProgram();
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    program: "",
    lokasi: "",
    status: "",
    source: "",
  });

  const { user: rawUser } = useAuth();

  const user = {
    ...rawUser,
    jobs:
      typeof rawUser?.jobs === "string"
        ? rawUser.jobs.split(",").map(Number)
        : rawUser?.jobs,
  };
  console.log(branches);

  const handleShow = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const sortedCustomers = [...filteredCustomers].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const paginatedCustomers = sortedCustomers.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setActivePage(pageNumber);
    }
  };

  useEffect(() => {
    let newFilteredCustomers = customers;

    // Filter Berdasarkan Tanggal
    if (filters.startDate) {
      newFilteredCustomers = newFilteredCustomers.filter(
        (lead) =>
          new Date(lead.created_at).setHours(0, 0, 0, 0) >=
          new Date(filters.startDate).setHours(0, 0, 0, 0)
      );
    }
    if (filters.endDate) {
      newFilteredCustomers = newFilteredCustomers.filter(
        (lead) =>
          new Date(lead.created_at).setHours(0, 0, 0, 0) <=
          new Date(filters.endDate).setHours(0, 0, 0, 0)
      );
    }

    // Filter Berdasarkan Program, Location, Status, dan Source
    if (filters.program && filters.program !== "All") {
      newFilteredCustomers = newFilteredCustomers.filter((lead) => {
        return lead.children.some(
          (program) => program.program_name === filters.program
        );
      });
    }

    if (filters.lokasi && filters.lokasi !== "All") {
      newFilteredCustomers = newFilteredCustomers.filter((lead) => {
        return lead.children.some(
          (lokasi) => lokasi.kode_cabang === filters.lokasi
        );
      });
    }

    if (filters.status && filters.status !== "All") {
      if (filters.status === "notapp") {
        newFilteredCustomers = newFilteredCustomers.filter(
          (lead) => lead.apprv_stat === null
        );
      } else {
        newFilteredCustomers = newFilteredCustomers.filter(
          (lead) => lead.apprv_stat === Number(filters.status)
        );
      }
    }
    if (filters.source && filters.source !== "All") {
      newFilteredCustomers = newFilteredCustomers.filter(
        (lead) => lead.source === filters.source
      );
    }

    setFilteredCustomers(newFilteredCustomers);
    setActivePage(1); // Reset ke halaman pertama jika filter berubah
  }, [filters, customers]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleExportToExcel = () => {
    const sortedCustomers = [...filteredCustomers].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    const exportData = sortedCustomers.map((customer, index) => ({
      No: index + 1,
      "Tgl Daftar": new Date(customer.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      "Tgl Bayar": customer.tanggal_bayar
        ? new Date(customer.tanggal_bayar).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      Nama: customer.name,
      HP: customer.phone,
      Email: customer.email,
      Status:
        customer.apprv_stat === null
          ? "Belum Approved"
          : customer.apprv_stat === 1
          ? "Sudah di Approved"
          : "Reject",
      Source: customer.source,
    }));

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString(
      "id-ID",
      {
        month: "short",
      }
    )}-${currentDate.getFullYear()}`;

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customers");

    const fileName = `Customers ${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
  };

  const formatKapital = (kelas) => {
    return kelas
      .split("_") // pisah berdasarkan underscore
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // kapital tiap kata
      .join(" "); // gabungkan kembali dengan spasi
  };

  return (
    <div className="container-xxl flex-grow-1 container-p-y">
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
                {programs &&
                  programs.map((program) => (
                    <option key={program.id} value={program.name}>
                      {program.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Location */}
            <div className="col-md-2">
              <label className="form-label">LOCATION</label>
              <select
                name="lokasi"
                className="form-select"
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                {user.jobs &&
                  user.jobs.length > 0 &&
                  Array.isArray(branches) && (
                    <>
                      {(user.jobs[0] === 1
                        ? branches
                        : branches.filter((branch) =>
                            user.jobs.includes(branch.id)
                          )
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
                <option value="0">Reject</option>
                <option value="1">Paid</option>
              </select>
            </div>

            {/* Source */}
            <div className="col-md-2">
              <label className="form-label">SOURCE</label>
              <select
                name="source"
                className="form-select"
                onChange={handleFilterChange}
              >
                <option>All</option>
                <option>AD</option>
                <option>SocMed</option>
                <option>Referral</option>
                <option>Web</option>
                <option>WAB</option>
                <option>Email</option>
              </select>
            </div>
          </div>
          {/* Tombol Filter */}
          <button className="btn btn-primary mt-3">Filter</button>
        </div>
      </div>

      {/* List data table */}
      <div className="card mt-4">
        <div className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fs-5 fw-bold">LIST CUSTOMER</h5>
          <button
            className="btn btn-success mt-3"
            onClick={handleExportToExcel}
          >
            <FaFileExcel size={20} />{" "}
            {/* Mengatur ukuran ikon dengan properti size */}
          </button>
        </div>
        <div className="card-body px-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tgl Daftar</th>
                  <th>Tgl Bayar</th>
                  <th>Nama</th>
                  <th>HP</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {/* Loading & Error Handling */}
                {isLoading && (
                  <tr>
                    <td colSpan={10}>
                      <motion.img
                        src={logo}
                        alt="Loading..."
                        width={40}
                        animate={{ rotate: 180 }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </td>
                  </tr>
                )}
                {error && (
                  <tr>
                    <td colSpan={10}>
                      <p className="text-danger">Error: {error}</p>
                    </td>
                  </tr>
                )}

                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {new Date(customer.created_at).toLocaleDateString(
                          "id-ID",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </td>
                      <td>
                        {customer.tanggal_bayar
                          ? new Date(customer.tanggal_bayar).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </td>
                      <td>
                        <Link
                          to="#"
                          className="btn btn-link"
                          onClick={() => handleShow(customer)}
                        >
                          {customer.name}
                        </Link>
                      </td>
                      <td>{customer.phone}</td>
                      <td>{customer.email}</td>
                      <td>
                        {(() => {
                          switch (customer.apprv_stat) {
                            case 0:
                              return "Reject";
                            case 1:
                              return "Paid";
                            default:
                              return null;
                          }
                        })()}
                      </td>
                      <td>{customer.source}</td>
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
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header>
          <Modal.Title>DETAIL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer ? (
            <>
              <div className="row">
                {/* Kiri: Detail Pembayaran */}
                <div className="col-md-6 text-center">
                  <img
                    src={selectedCustomer.gambar}
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
                    <strong>ORDER ID:</strong> {selectedCustomer.invoice}
                  </p>
                  <p>
                    <strong>Tanggal Bayar: </strong>
                    {selectedCustomer.tanggal_bayar
                      ? new Date(
                          selectedCustomer.tanggal_bayar
                        ).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : ""}
                  </p>
                  <p>
                    <strong>Tipe Pembayaran:</strong>{" "}
                    {selectedCustomer.link_url !== null
                      ? "Online Payment"
                      : "Offline Payment"}
                  </p>
                  <p>
                    <strong>Jenis Pembayaran:</strong>{" "}
                    {selectedCustomer.link_url !== null
                      ? "Xendit"
                      : formatKapital(selectedCustomer.payment_method)}
                  </p>

                  {/* Tampilkan hanya jika Offline Payment */}
                  {selectedCustomer.link_url === null && (
                    <>
                      {/* Jika bukan Cash, tampilkan Bank dan Nama Pemilik Kartu */}
                      {selectedCustomer.payment_method !== "cash" && (
                        <>
                          <p>
                            <strong>Bank:</strong> {selectedCustomer.nama_bank}
                          </p>
                          <p>
                            <strong>Nama Pemilik Kartu:</strong>{" "}
                            {selectedCustomer.nama_kartu}
                          </p>
                        </>
                      )}

                      {/* Tampilkan Cicilan hanya jika jenis pembayaran adalah Cicilan */}
                      {selectedCustomer.payment_method === "cicilan_bank" && (
                        <p>
                          <strong>Cicilan:</strong>{" "}
                          {selectedCustomer.bulan_cicilan} Bulan
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

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
                    {selectedCustomer.children &&
                    selectedCustomer.children.length > 0 ? (
                      selectedCustomer.children.map((child, index) => (
                        <tr key={child.children}>
                          <td>{index + 1}</td>
                          <td>{child.program_name}</td>
                          <td>{child.kode_cabang}</td>
                          <td>{child.nama_murid}</td>
                          <td>
                            {selectedCustomer.id_program === 6
                              ? child.tipe?.charAt(0).toUpperCase() +
                                child.tipe?.slice(1) +
                                " - " +
                                child.durasi +
                                " Jam"
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
                      <td colSpan={5}>
                        <strong>SUBTOTAL</strong>
                      </td>
                      <td>
                        <strong>
                          {selectedCustomer.id_program !== 6
                            ? formatRupiah(
                                selectedCustomer.children.reduce(
                                  (sum, child) => sum + child.price,
                                  0
                                )
                              )
                            : formatRupiah(
                                selectedCustomer.children[0]?.price *
                                  selectedCustomer.durasi *
                                  selectedCustomer.jmlh_anak
                              )}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5}>
                        <strong>DISCOUNT</strong>
                      </td>
                      <td>
                        <strong>
                          {selectedCustomer.id_program !== 6
                            ? formatRupiah(
                                selectedCustomer.children.reduce(
                                  (sum, child) => sum + child.price,
                                  0
                                ) - selectedCustomer.total_fix
                              )
                            : formatRupiah(
                                selectedCustomer.children[0]?.price *
                                  selectedCustomer.durasi *
                                  selectedCustomer.jmlh_anak -
                                  selectedCustomer.total_fix
                              )}
                        </strong>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={5}>
                        <strong>TOTAL</strong>
                      </td>
                      <td>
                        <strong>
                          {formatRupiah(selectedCustomer.total_fix)}
                        </strong>
                      </td>
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

export default DaftarCustomerLcm;
