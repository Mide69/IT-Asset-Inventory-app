import React, { useState, useEffect } from 'react';

const StudentList = ({ onEdit }) => {
  const [students, setStudents] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    sex: '',
    department: ''
  });

  useEffect(() => {
    fetchStudents();
  }, [filters]);

  const fetchStudents = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const response = await fetch(`/api/v1/students?${params}`);
      const data = await response.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`/api/v1/students/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchStudents();
        }
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    }
  };

  return (
    <div className="students-container">
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search students..."
          value={filters.search}
          onChange={(e) => setFilters({...filters, search: e.target.value})}
          className="search-input"
        />
        <select
          value={filters.level}
          onChange={(e) => setFilters({...filters, level: e.target.value})}
        >
          <option value="">All Levels</option>
          <option value="100">100 Level</option>
          <option value="200">200 Level</option>
          <option value="300">300 Level</option>
          <option value="400">400 Level</option>
          <option value="500">500 Level</option>
        </select>
        <select
          value={filters.sex}
          onChange={(e) => setFilters({...filters, sex: e.target.value})}
        >
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={filters.department}
          onChange={(e) => setFilters({...filters, department: e.target.value})}
        >
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Medicine">Medicine</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
        </select>
      </div>

      <h2>Students ({students.length})</h2>
      {students.length === 0 ? (
        <p className="no-students">No students found.</p>
      ) : (
        <div className="students-grid">
          {students.map(student => (
            <div key={student.id} className="student-card">
              {student.picture && (
                <img 
                  src={student.picture} 
                  alt={student.name}
                  className="student-photo"
                />
              )}
              <h3>{student.name}</h3>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Age:</strong> {student.age}</p>
              <p><strong>Course:</strong> {student.course}</p>
              <p><strong>Level:</strong> {student.level}</p>
              <p><strong>Sex:</strong> {student.sex}</p>
              <p><strong>Department:</strong> {student.department}</p>
              <div className="card-actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => onEdit(student)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => handleDelete(student.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentList;