import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Pagination, Modal, Button } from "react-bootstrap";
import Select from "react-select";
import { FaWhatsapp } from "react-icons/fa";
import { FcCallback } from "react-icons/fc";
import { MdClose, MdCheck, MdCall } from "react-icons/md";
import { motion } from "framer-motion";
import logo from "../../../../assets/img/icon-mrevents.png";
import * as XLSX from "xlsx";
import { FaFileExcel } from "react-icons/fa"; // Import ikon Excel
import { useLeadsLcm } from "../../../../context/ProspectLcmContext";
import { useBranch, useProgram } from "../../../../context/BranchContext";
import { useAuth } from "../../../../context/AuthContext";

const LeadsLcm = () => {
  const { leads, isLoading, error, updateLeadCall } = useLeadsLcm();
  const { branches } = useBranch();
  const { programs } = useProgram();
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const filterTriggeredRef = useRef(false);
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
    jobs: typeof rawUser?.jobs === "string"
      ? rawUser.jobs.split(",").map(Number)
      : rawUser?.jobs,
  };
  console.log(branches)

  const itemsPerPage = 10;

  const handleShow = (lead) => {
    setSelectedLead(lead);
    setShowModal(true);
  };
  const handleClose = () => {
    setSelectedLead(null);
    setShowModal(false);
  };

  function getUTCDateWithoutTime(dateString) {
    const date = new Date(dateString);
    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    );
  }

  useEffect(() => {
    let newFilteredLeads = leads;

    // Filter Berdasarkan Tanggal
    if (filters.startDate) {
      const filterStart = getUTCDateWithoutTime(filters.startDate);

      newFilteredLeads = newFilteredLeads.filter((lead) => {
        const leadDateUTC = getUTCDateWithoutTime(lead.created_at);
        return leadDateUTC >= filterStart;
      });
    }
    // if (filters.startDate) {
    //   newFilteredLeads = newFilteredLeads.filter(
    //     (lead) =>
    //       new Date(lead.created_at).setHours(0, 0, 0, 0) >=
    //       new Date(filters.startDate).setHours(0, 0, 0, 0)
    //   );
    // }
    if (filters.endDate) {
      newFilteredLeads = newFilteredLeads.filter(
        (lead) =>
          new Date(lead.created_at).setHours(0, 0, 0, 0) <=
          new Date(filters.endDate).setHours(0, 0, 0, 0)
      );
    }

    // Filter Berdasarkan Program, Term, Status, dan Source
    if (filters.program && filters.program !== "All") {
      newFilteredLeads = newFilteredLeads.filter(
        (lead) => lead.program_name === filters.program
      );
    }
    if (filters.lokasi && filters.lokasi !== "All") {
      newFilteredLeads = newFilteredLeads.filter(
        (lead) => lead.cabang === filters.lokasi
      );
    }
    if (filters.status && filters.status !== "All") {
      newFilteredLeads = newFilteredLeads.filter(
        (lead) => lead.status === Number(filters.status)
      );
    }
    if (filters.source && filters.source !== "All") {
      newFilteredLeads = newFilteredLeads.filter(
        (lead) => lead.source === filters.source
      );
    }

    setFilteredLeads(newFilteredLeads);
    if (filterTriggeredRef.current) {
      setActivePage(1);
      filterTriggeredRef.current = false;
    }
  }, [filters, leads]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const sortedLeads = [...filteredLeads].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  const paginatedLeads = sortedLeads.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setActivePage(pageNumber);
    }
  };

  // Function to map the FU values to the desired status
  const getFUStatus = (callStatus) => {
    switch (callStatus) {
      case "0":
        return "Belum di FU";
      case "1":
        return "Sudah di WA";
      case "2":
        return "Callback";
      case "3":
        return "Reject";
      case "4":
        return "Selesai FU";
      case "5":
        return ". 1";
      case "6":
        return ". 2";
      case "7":
        return ". 3";
      default:
        return "Unknown";
    }
  };

  function formatDateToIndonesianUTC(dateString) {
    const date = new Date(dateString);
    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    const year = date.getUTCFullYear();

    // Daftar nama bulan bahasa Indonesia
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    return `${day} ${months[month]} ${year}`;
  }

  const handleExportToExcel = () => {
    const sortedLeads = [...filteredLeads].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    // Tentukan kolom yang ingin diekspor
    const exportData = sortedLeads.map((lead, index) => {
      const formattedDate = formatDateToIndonesianUTC(lead.created_at);
      return {
        No: index + 1,
        "Tgl Daftar": formattedDate,
        "Tgl Bayar": lead.tgl_bayar,
        Nama: lead.name,
        HP: lead.phone,
        Email: lead.email,
        Status:
          lead.status === 0
            ? "Pending"
            : lead.status === 1
            ? "Paid"
            : "Expired",
        Source: lead.source,
        FU: getFUStatus(lead.call),
      };
    });

    // Mendapatkan tanggal saat ini untuk nama file
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate()}-${currentDate.toLocaleString(
      "id-ID",
      {
        month: "short",
      }
    )}-${currentDate.getFullYear()}`;

    // Buat workbook dan worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Leads");

    // Membuat nama file sesuai format yang diinginkan: Leads program_name tanggal bulan tahun
    const fileName = `Leads ${formattedDate}.xlsx`;

    // Simpan file Excel
    XLSX.writeFile(wb, fileName);
  };

  const FOLLOW_UP = [
    { value: "0", label: "Select" },
    { value: "1", label: <FaWhatsapp style={{ color: "green" }} /> },
    { value: "2", label: <FcCallback /> },
    { value: "3", label: <MdClose style={{ color: "red" }} /> },
    { value: "4", label: <MdCheck style={{ color: "green" }} /> },
    {
      value: "5",
      label: (
        <span style={{ color: "red" }}>
          <MdCall style={{ color: "red" }} />1
        </span>
      ),
    },
    {
      value: "6",
      label: (
        <span style={{ color: "red" }}>
          <MdCall style={{ color: "red" }} />2
        </span>
      ),
    },
    {
      value: "7",
      label: (
        <span style={{ color: "red" }}>
          <MdCall style={{ color: "red" }} />3
        </span>
      ),
    },
  ];

  const handleFilterChange = (e) => {
    filterTriggeredRef.current = true;
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
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
              <select name="program" className="form-select" onChange={handleFilterChange}>
                <option>All</option>
                {/* {isLoadingP && <option disabled>Loading...</option>}
                {errorP && <option disabled>Error loading program</option>} */}

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
                <option value="All">All</option>
                <option value="0">Pending</option>
                <option value="2">Expired</option>
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
          <h5 className="mb-0 fs-5 fw-bold">LEADS SESI PERKENALAN</h5>
          <button
            className="btn btn-success mt-3"
            onClick={handleExportToExcel}
          >
            <FaFileExcel size={20} />{" "}
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
                  <th>FU</th>
                </tr>
              </thead>
              <tbody>
                {/* Loading & Error Handling */}
                {isLoading && <tr><td colSpan={11}><motion.img
                    src={logo}
                    alt="Loading..."
                    width={40}
                    animate={{ rotate: 180 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                /></td></tr>}
                {error && <tr><td colSpan={10}><p className="text-danger">Error: {error}</p></td></tr>}

                {paginatedLeads.length > 0 ? (
                  paginatedLeads.map((lead, index) => (
                    <tr key={lead.id}>
                      <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {new Date(lead.created_at).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })}
                      </td>
                      <td>
                        {lead.tgl_bayar ? new Date(lead.tgl_bayar).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        }) : ""}
                      </td>
                      <td>
                        <Link to="#" onClick={() => handleShow(lead)}>
                          {lead.name}
                        </Link>
                      </td>
                      <td>
                        <a
                          href={`https://wa.me/${lead.phone}?text=Berikut%20Link%20Pembayarannya%20:%20${lead.link_url}%20Note%20:%20Setelah%20Anda%20memilih%20Metode%20Pembayaran%2C%20link%20pembayaran%20tersebut%20akan%20berlaku%20selama%2024%20jam.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", backgroundColor: "#0fc144", padding: "8px 10px", borderRadius: "5px", width: "80%", textDecoration: "none"}}
                        >
                          <FaWhatsapp style={{color: "white", fontSize: "12px", marginRight: "10px"}}/>
                          <span style={{ color: "white", fontWeight: "bold", fontSize: "12px"}} >
                            {lead.phone}
                          </span>
                        </a>
                      </td>
                      <td>{lead.email}</td>
                      <td>
                        {(() => {
                            switch (lead.status) {
                            case 0:
                                return "Pending";
                            case 1:
                                return "Paid";
                            case 2:
                                return "Expired";
                            default:
                                return "Unknown";
                            }
                        })()}
                      </td>
                      <td>{lead.source}</td>
                      <td>
                        <Select 
                            options={FOLLOW_UP}
                            isSearchable={false}
                            value={FOLLOW_UP.find(option => option.value === lead.call)}
                            onChange={(selectOption) => updateLeadCall.mutate({ 
                                leadId: lead.id, 
                                newCallValue: selectOption.value 
                            })}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            menuPlacement="auto"
                        />
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
          {selectedLead ? (
            <>
              <p>
                <strong>ORDER ID:</strong> {selectedLead.no_inv}
              </p>
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead className="text-center">
                    <tr>
                      <th>No</th>
                      <th>Program</th>
                      <th>Location</th>
                      <th>Student</th>
                      <th>Harga</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr>
                      <td>1</td>
                      <td>{selectedLead.program_name}</td>
                      <td>{selectedLead.cabang}</td>
                      <td>{selectedLead.name}</td>
                      <td>Rp {selectedLead.invoice_sp ?? "99.000"}</td>
                    </tr>
                    <tr>
                      <td colSpan={4}>
                        <strong>TOTAL</strong>
                      </td>
                      <td><strong>Rp {selectedLead.invoice_sp ?? "99.000"}</strong></td>
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

export default LeadsLcm;
