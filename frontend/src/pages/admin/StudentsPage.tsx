// src/pages/admin/StudentsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, Filter, Calendar, AlertCircle, UserCheck, UserX, MoreVertical } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Student {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
}

const StudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    bio: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const studentUsers = await userAPI.getStudents();
        setStudents(studentUsers);
        setFilteredStudents(studentUsers);
      } catch (err: any) {
        setError('Failed to load students. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStudents();
    }
  }, [user]);

  // Filter students based on search term and status
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter((student) =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((student) =>
        statusFilter === 'active' ? student.is_active : !student.is_active
      );
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter]);

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge bg-success d-flex align-items-center">
        <UserCheck size={12} className="me-1" />
        Active
      </span>
    ) : (
      <span className="badge bg-danger d-flex align-items-center">
        <UserX size={12} className="me-1" />
        Inactive
      </span>
    );
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (editingStudent) {
        // Update student
        const updatedStudent = await userAPI.updateStudent(editingStudent.id, {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio || null,
        });
        setStudents((prev) =>
          prev.map((student) => (student.id === editingStudent.id ? updatedStudent.data : student))
        );
        setSuccess('Student updated successfully');
      } else {
        // Create student
        const newStudent = await userAPI.createStudent({
          ...formData,
          role: 'student',
          is_active: true,
        });
        setStudents((prev) => [...prev, newStudent.data]);
        setSuccess('Student created successfully');
      }
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ username: '', email: '', first_name: '', last_name: '', password: '', bio: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to save student');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    setError(null);
    setSuccess(null);

    try {
      await userAPI.deleteStudent(id);
      setStudents((prev) => prev.filter((student) => student.id !== id));
      setSuccess('Student deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete student');
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setError(null);
    setSuccess(null);

    try {
      const updatedStudent = await userAPI.toggleStudentStatus(id, !isActive);
      setStudents((prev) =>
        prev.map((student) => (student.id === id ? updatedStudent.data : student))
      );
      setSuccess(`Student ${isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err: any) {
      setError(err.message || `Failed to ${isActive ? 'deactivate' : 'activate'} student`);
    }
  };

  const openModal = (student: Student | null = null) => {
    setEditingStudent(student);
    setFormData(
      student
        ? {
            username: student.username,
            email: student.email,
            first_name: student.first_name,
            last_name: student.last_name,
            password: '',
            bio: student.bio || '',
          }
        : { username: '', email: '', first_name: '', last_name: '', password: '', bio: '' }
    );
    setShowModal(true);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} className="me-2" />
          You are not authorized to view this page.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container-fluid py-4 fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1">Student Management</h1>
          <p className="text-muted mb-0">Manage student accounts and monitor their activity</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add New Student
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <AlertCircle size={18} className="me-2" />
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
          <UserCheck size={18} className="me-2" />
          {success}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search students by name, email, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="d-flex align-items-center text-muted">
                <Filter size={16} className="me-1" />
                {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-primary bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <Users className="text-primary" size={24} />
              </div>
              <h4 className="mb-1">{students.length}</h4>
              <div className="text-muted">Total Students</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <UserCheck className="text-success" size={24} />
              </div>
              <h4 className="mb-1">{students.filter((s) => s.is_active).length}</h4>
              <div className="text-muted">Active Students</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <UserX className="text-warning" size={24} />
              </div>
              <h4 className="mb-1">{students.filter((s) => !s.is_active).length}</h4>
              <div className="text-muted">Inactive Students</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-info bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <Calendar className="text-info" size={24} />
              </div>
              <h4 className="mb-1">
                {students.filter((s) => {
                  const createdDate = new Date(s.created_at);
                  const thirtyDaysAgo = new Date();
                  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                  return createdDate >= thirtyDaysAgo;
                }).length}
              </h4>
              <div className="text-muted">New This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">All Students</h5>
        </div>
        <div className="card-body p-0">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-5">
              <Users size={48} className="text-muted mb-3" />
              <h5 className="mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No students match your criteria' : 'No students found'}
              </h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Students will appear here once they register for the platform.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="avatar bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                            style={{ width: '40px', height: '40px' }}
                          >
                            {student.profile_picture ? (
                              <img
                                src={student.profile_picture}
                                alt={`${student.first_name} ${student.last_name}`}
                                className="img-fluid rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            ) : (
                              `${student.first_name.charAt(0)}${student.last_name.charAt(0)}`
                            )}
                          </div>
                          <div>
                            <div className="fw-medium">
                              {student.first_name} {student.last_name}
                            </div>
                            <div className="text-muted small">@{student.username}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="small">{student.email}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(student.is_active)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="text-muted me-1" />
                          <span className="small">
                            {new Date(student.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <button
                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <MoreVertical size={14} />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <button className="dropdown-item" onClick={() => openModal(student)}>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(student.id)}
                              >
                                Delete
                              </button>
                            </li>
                            <li>
                              <button
                                className={`dropdown-item ${student.is_active ? 'text-warning' : 'text-success'}`}
                                onClick={() => handleToggleStatus(student.id, student.is_active)}
                              >
                                {student.is_active ? 'Deactivate' : 'Activate'}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Student */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingStudent ? 'Edit Student' : 'Add New Student'}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateOrUpdate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      required
                    />
                  </div>
                  {!editingStudent && (
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingStudent ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;