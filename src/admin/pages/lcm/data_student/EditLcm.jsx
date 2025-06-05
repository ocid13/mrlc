import React, { useEffect, useState} from "react";
import { Button, Form, Card, Table, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useStudents } from "../../../../context/StudentLcmContext";

const EditLcm = () => {
  const { students, isLoading, error } = useStudents();
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);

    useEffect(() => {
        if (students.length > 0) {
            const selectedStudent = students.find(student => student.id.toString() === id);
            setStudent(selectedStudent);
        }
    }, [students, id]);

    const formatKelas = (kelas) => {
    const parts = kelas.split('_'); // Pisah jadi ['kamis', '1600', '1800']
    if (parts.length !== 3) return kelas;

    const [hari, start, end] = parts;

    const formatWaktu = (waktu) => {
      if (waktu.length !== 4) return waktu;
      return `${waktu.slice(0, 2)}:${waktu.slice(2)}`;
    };

    return `${capitalize(hari)} ${formatWaktu(start)} - ${formatWaktu(end)}`;
  };

  const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error fetching data</p>;

    return (
      <div className="container-fluid mt-4">
        <Row className="row justify-content-center">
          <Col lg={10} xl={12}>
            <Card className="shadow-lg">
              <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                <h4 className="m-0 text-white">{student?.program_name}</h4>
              </Card.Header>
              <Card.Body>
                {/* Data Student */}
                <h5 className="mb-3 mt-3 fs-5 fw-bold">DATA STUDENT</h5>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group className="d-flex align-items-center mb-2">
                      <Form.Label className="me-3" style={{ minWidth: "80px" }}>
                        Nama
                      </Form.Label>
                      <Form.Control type="text" value={student?.name} readOnly />
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mb-2">
                      <Form.Label className="me-3" style={{ minWidth: "80px" }}>
                        HP
                      </Form.Label>
                      <Form.Control type="text" value={student?.phone} readOnly />
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mb-2">
                      <Form.Label className="me-3" style={{ minWidth: "80px" }}>
                        Email
                      </Form.Label>
                      <Form.Control type="email" value={student?.email} readOnly />
                    </Form.Group>

                    {/* Row untuk Tanggal Lahir dan Usia */}
                    <Row>
                      <Col md={6}>
                        <Form.Group className="d-flex align-items-center mb-2">
                          <Form.Label className="me-3" style={{ minWidth: "80px" }} >
                            Tgl Lahir
                          </Form.Label>
                          <Form.Control type="date" value={student?.tgl_lahir} readOnly
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="d-flex align-items-center mb-2">
                          <Form.Label className="me-2" style={{ minWidth: "30px" }}>
                            Usia
                          </Form.Label>
                          <Form.Control type="text" value={student?.age} readOnly style={{ width: "60px" }} />
                          <Form.Label className="ms-2">Tahun</Form.Label>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="d-flex align-items-center mb-2">
                      <Form.Label className="me-3" style={{ minWidth: "80px" }}>Jenis Kelamin</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check type="radio" label="Laki-Laki" name="jenisKelamin" id="laki-laki" value="Laki-Laki" checked={student?.jenis_kelamin === "Laki-Laki"} readOnly />
                        <Form.Check type="radio" label="Perempuan" name="jenisKelamin" id="perempuan" value="Perempuan" checked={student?.jenis_kelamin === "Perempuan"} readOnly />
                      </div>
                    </Form.Group>
                    <Form.Group className='d-flex align-items-center mb-2'>
                      <Form.Label className="me-3" style={{ minWidth: "80px" }}>{student?.id_program === 6 ? 'Pekerjaan' : 'Sekolah'}</Form.Label>
                      <Form.Control type="text" value={student?.asal_sekolah} readOnly />
                    </Form.Group>
                  </Col>
                </Row>

                {/* Data Parent */}
                <div className={`${student?.id_program === 6 ? 'd-none' : ''}`}>
                  <br />
                  <h5 className="mb-3 mt-3 fs-5 fw-bold">DATA PARENTS</h5>
                  <Row className="mb-3">
                    <Col md={6}>
                      <h6 className="fs-5 fw-bold">AYAH</h6>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: "80px" }}>Nama</Form.Label>
                        <Form.Control type="text" value={student?.father_name} readOnly />
                      </Form.Group>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: "80px" }}>HP</Form.Label>
                        <Form.Control type="text" value={student?.father_phone} readOnly />
                      </Form.Group>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: "80px" }}>Email</Form.Label>
                        <Form.Control type="email" value={student?.father_email} readOnly />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <h6 className="fs-5 fw-bold">IBU</h6>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: "80px" }}>Nama</Form.Label>
                        <Form.Control type="text" value={student?.mother_name} readOnly />
                      </Form.Group>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: "80px" }}>HP</Form.Label>
                        <Form.Control type="text" value={student?.mother_phone} readOnly />
                      </Form.Group>
                      <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: "80px" }}>Email</Form.Label>
                        <Form.Control type="email" value={student?.mother_email} readOnly />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Alamat */}
                <br />
                <h5 className="mb-3 mt-3 fs-5 fw-bold">ALAMAT</h5>
                <Row className="mb-3">
                  <Form.Group className="d-flex align-items-center mb-2">
                    <Form.Label className="me-3" style={{ minWidth: '80px' }}>Alamat</Form.Label>
                    <Form.Control type="text" value={student?.address} readOnly />
                  </Form.Group>
                  <Col md={6}>
                    <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: '80px' }}>Provinsi</Form.Label>
                        <Form.Control type="text" value={student?.provinsi} readOnly />
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: '80px' }}>Kota</Form.Label>
                        <Form.Control type="text" value={student?.name_kota} readOnly />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: '80px' }}>Kecamatan</Form.Label>
                        <Form.Control type="text" value={student?.namakec} readOnly />
                    </Form.Group>
                    <Form.Group className="d-flex align-items-center mb-2">
                        <Form.Label className="me-3" style={{ minWidth: '80px' }}>Kode pos</Form.Label>
                        <Form.Control type="text" value={student?.kodepos} readOnly />
                    </Form.Group>
                  </Col>
                </Row>

                {/* History */}
                <br />
                <h5 className="mb-3 mt-3 fs-5 fw-bold">HISTORY</h5>
                <Row>
                  <Col md={5}>
                    <Table bordered className="table-responsive">
                      <thead className="text-center">
                        <tr>
                          <th>No</th>
                          <th>Tgl Bayar</th>
                          <th>Location</th>
                          <th>Program</th>
                          <th>Kelas</th>
                          <th>Jenis</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {student?.program_histories && student.program_histories.length > 0 ? (
                          student.program_histories.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                {item.tanggal_masuk ? new Date(item.tanggal_masuk).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })
                                : ""}
                              </td>
                              <td>{item.branch_name}</td>
                              <td>{item.program_name}</td>
                              <td>{item.id_program === 6 ? item.durasi + ' Jam' : item.kelas ? formatKelas(item.kelas) : '-'}</td>
                              <td>
                                {item.id_program === 6
                                ? item.tipe?.charAt(0).toUpperCase() + item.tipe?.slice(1)
                                : item.course_name}
                              </td>
                            </tr>
                          ))
                        ): (
                          <tr>
                              <td colSpan="6">Tidak ada history</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-end">
                <Button
                  variant="secondary"
                  className="ms-2"
                  onClick={() => navigate("/admin/student")}
                >
                  Close
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    );
}

export default EditLcm;
