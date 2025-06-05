import React, { useState, useEffect } from "react";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../../../assets/img/icon-mrevents.png";
import * as XLSX from "xlsx"; // Import XLSX for Excel export
import { FaFileExcel } from "react-icons/fa"; // Excel icon
import { useStudents } from "../../../../context/StudentLcmContext";
import { useBranch, useProgram } from "../../../../context/BranchContext";
import { useAuth } from "../../../../context/AuthContext";

const StudentLcm = () => {
  const { students, isLoading, error } = useStudents();
  const { branches } = useBranch();
  const { programs } = useProgram();
  const [activePage, setActivePage] = useState(1);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    program: "",
    lokasi: "",
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

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = [...filteredStudents]
    .sort((a, b) => new Date(b.tgl_bayar) - new Date(a.tgl_bayar))
    .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setActivePage(pageNumber);
    }
  };

  useEffect(() => {
    let newFilteredStudents = students;

    // Filter Berdasarkan Tanggal
    if (filters.startDate) {
      newFilteredStudents = newFilteredStudents.filter(
        (lead) =>
          lead.tgl_bayar &&
          new Date(lead.tgl_bayar).setHours(0, 0, 0, 0) >=
            new Date(filters.startDate).setHours(0, 0, 0, 0)
      );
    }
    if (filters.endDate) {
      newFilteredStudents = newFilteredStudents.filter(
        (lead) =>
          lead.tgl_bayar &&
          new Date(lead.tgl_bayar).setHours(0, 0, 0, 0) <=
            new Date(filters.endDate).setHours(0, 0, 0, 0)
      );
    }

    // Filter Berdasarkan Program, Location, Status, dan Source
    if (filters.program && filters.program !== "All") {
      newFilteredStudents = newFilteredStudents.filter(
        (lead) => lead.program_name === filters.program
      );
    }
    if (filters.lokasi && filters.lokasi !== "All") {
      newFilteredStudents = newFilteredStudents.filter(
        (lead) => lead.branch_name === filters.lokasi
      );
    }
    if (filters.jenis && filters.jenis !== "All") {
      newFilteredStudents = newFilteredStudents.filter((lead) => {
        if (lead.id_program === 6) {
          return lead.tipe?.toLowerCase() === filters.jenis.toLowerCase();
        } else {
          return lead.course_name === filters.jenis
        }
      });
    }

    setFilteredStudents(newFilteredStudents);
    setActivePage(1); // Reset ke halaman pertama jika filter berubah
  }, [filters, students]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleExportToExcel = () => {
    const exportData = filteredStudents.map((student, index) => ({
      No: index + 1,
      "Tgl Bayar": student.tgl_bayar
        ? new Date(student.tgl_bayar).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "",
      Nama: student.name,
      HP: student.phone,
      Email: student.email,
      Program: student.program_name,
      Jenis:
    student.id_program === 6
      ? student.tipe?.charAt(0).toUpperCase() + student.tipe?.slice(1)
      : student.course_name,
      Lokasi: student.branch_name,
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
    XLSX.utils.book_append_sheet(wb, ws, "Students");

    const fileName = `Students ${formattedDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
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
              <label className="form-label">JENIS</label>
              <select className="form-select" name="jenis" onChange={handleFilterChange}>
                <option value="">All</option>
                <option value="Full Program">Full Program</option>
                <option value="Modul">Modul</option>
                <option value="onsite">Onsite</option>
                <option value="online">Online</option>
              </select>
            </div>
          </div>
          {/* Tombol Filter */}
          <button className="btn btn-primary mt-3">Filter</button>
        </div>
      </div>

      <div className="card mt-4">
        <div className="card-header text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fs-5 fw-bold">LIST STUDENT</h5>
          <button
            className="btn btn-success mt-3"
            onClick={handleExportToExcel}
          >
            <FaFileExcel size={20} />
          </button>
        </div>
        <div className="card-body px-0">
          <div className="table-responsive">
            <table className="table table-striped table-hover text-center">
              <thead className="text-center">
                <tr>
                  <th>No</th>
                  <th>Tgl Bayar</th>
                  <th>Nama</th>
                  <th>HP</th>
                  <th>Email</th>
                  <th>Program</th>
                  <th>Jenis</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {/* Loading & Error Handling */}
                {isLoading && <tr><td colSpan={10}><motion.img
                    src={logo}
                    alt="Loading..."
                    width={40}
                    animate={{ rotate: 180 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                /></td></tr>}
                {error && <tr><td colSpan={10}><p className="text-danger">Error: {error}</p></td></tr>}
                
                {paginatedStudents.length > 0 ? (
                  paginatedStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                      <td>
                        {student.tgl_bayar ? new Date(student.tgl_bayar).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric"
                        })
                        : ""}
                      </td>
                      <td>
                        <Link to={`/admin/edit/${student.id}`} className="btn btn-link">{student.name}</Link>
                      </td>
                      <td>{student.phone}</td>
                      <td>{student.email}</td>
                      <td>{student.program_name}</td>
                      <td>
                        {student.id_program === 6
                          ? student.tipe?.charAt(0).toUpperCase() + student.tipe?.slice(1)
                          : student.course_name}
                      </td>
                      <td>{student.branch_name}</td>
                      
                    </tr>
                  ))
                ) : (
                    <tr>
                        <td colSpan="8">No data available</td>
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
    </div>
  );
};

export default StudentLcm;
