import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Calendar, AlertCircle, UserCheck, UserX, MoreVertical, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Teacher {
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

const TeachersPage: React.FC = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    bio: '',
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const teacherUsers = await userAPI.getTeachers();
        setTeachers(teacherUsers);
        setFilteredTeachers(teacherUsers);
      } catch (err: any) {
        setError('Failed to load teachers. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchTeachers();
    }
  }, [user]);

  // Filter teachers based on search term and status
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter((teacher) =>
        teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((teacher) =>
        statusFilter === 'active' ? teacher.is_active : !teacher.is_active
      );
    }

    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, statusFilter]);

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
      if (editingTeacher) {
        // Update teacher
        const updatedTeacher = await userAPI.updateTeacher(editingTeacher.id, {
          username: formData.username,
          email: formData.email,
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio || null,
        });
        setTeachers((prev) =>
          prev.map((teacher) => (teacher.id === editingTeacher.id ? updatedTeacher.data : teacher))
        );
        setSuccess('Teacher updated successfully');
      } else {
        // Create teacher
        const newTeacher = await userAPI.createTeacher({
          ...formData,
          role: 'teacher',
          is_active: true,
        });
        setTeachers((prev) => [...prev, newTeacher.data]);
        setSuccess('Teacher created successfully');
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({ username: '', email: '', first_name: '', last_name: '', password: '', bio: '' });
    } catch (err: any) {
      setError(err.message || 'Failed to save teacher');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;
    setError(null);
    setSuccess(null);

    try {
      await userAPI.deleteTeacher(id);
      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
      setSuccess('Teacher deleted successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete teacher');
    }
  };

  const handleToggleStatus = async (id: number, isActive: boolean) => {
    setError(null);
    setSuccess(null);

    try {
      const updatedTeacher = await userAPI.toggleUserStatus(id, !isActive);
      setTeachers((prev) =>
        prev.map((teacher) => (teacher.id === id ? updatedTeacher.data : teacher))
      );
      setSuccess(`Teacher ${isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err: any) {
      setError(err.message || `Failed to ${isActive ? 'deactivate' : 'activate'} teacher`);
    }
  };

  const openModal = (teacher: Teacher | null = null) => {
    setEditingTeacher(teacher);
    setFormData(
      teacher
        ? {
            username: teacher.username,
            email: teacher.email,
            first_name: teacher.first_name,
            last_name: teacher.last_name,
            password: '',
            bio: teacher.bio || '',
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
          <h1 className="h3 mb-1">Teacher Management</h1>
          <p className="text-muted mb-0">Manage teacher accounts and monitor their activity</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          Add New Teacher
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
                  placeholder="Search teachers by name, email, or username..."
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
                {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found
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
                <Award className="text-primary" size={24} />
              </div>
              <h4 className="mb-1">{teachers.length}</h4>
              <div className="text-muted">Total Teachers</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-success bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <UserCheck className="text-success" size={24} />
              </div>
              <h4 className="mb-1">{teachers.filter((t) => t.is_active).length}</h4>
              <div className="text-muted">Active Teachers</div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="rounded-circle bg-warning bg-opacity-10 p-3 mx-auto mb-3" style={{ width: 'fit-content' }}>
                <UserX className="text-warning" size={24} />
              </div>
              <h4 className="mb-1">{teachers.filter((t) => !t.is_active).length}</h4>
              <div className="text-muted">Inactive Teachers</div>
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
                {teachers.filter((t) => {
                  const createdDate = new Date(t.created_at);
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

      {/* Teachers Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">All Teachers</h5>
        </div>
        <div className="card-body p-0">
          {filteredTeachers.length === 0 ? (
            <div className="text-center py-5">
              <Award size={48} className="text-muted mb-3" />
              <h5 className="mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No teachers match your criteria' : 'No teachers found'}
              </h5>
              <p className="text-muted">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters.'
                  : 'Teachers will appear here once they register for the platform.'}
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>Teacher</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div
                            className="avatar bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                            style={{ width: '40px', height: '40px' }}
                          >
                            {teacher.profile_picture ? (
                              <img
                                src={teacher.profile_picture}
                                alt={`${teacher.first_name} ${teacher.last_name}`}
                                className="img-fluid rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            ) : (
                              `${teacher.first_name.charAt(0)}${teacher.last_name.charAt(0)}`
                            )}
                          </div>
                          <div>
                            <div className="fw-medium">
                              {teacher.first_name} {teacher.last_name}
                            </div>
                            <div className="text-muted small">@{teacher.username}</div>
                            {teacher.bio && (
                              <div className="text-muted small" style={{ maxWidth: '200px' }}>
                                {teacher.bio.length > 50 ? `${teacher.bio.substring(0, 50)}...` : teacher.bio}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="small">{teacher.email}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(teacher.is_active)}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <Calendar size={14} className="text-muted me-1" />
                          <span className="small">
                            {new Date(teacher.created_at).toLocaleDateString()}
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
                              <button className="dropdown-item" onClick={() => openModal(teacher)}>
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                className="dropdown-item text-danger"
                                onClick={() => handleDelete(teacher.id)}
                              >
                                Delete
                              </button>
                            </li>
                            <li>
                              <button
                                className={`dropdown-item ${teacher.is_active ? 'text-warning' : 'text-success'}`}
                                onClick={() => handleToggleStatus(teacher.id, teacher.is_active)}
                              >
                                {teacher.is_active ? 'Deactivate' : 'Activate'}
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

      {/* Modal for Create/Edit Teacher */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</h5>
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
                  {!editingTeacher && (
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
                    {editingTeacher ? 'Update' : 'Create'}
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

export default TeachersPage;