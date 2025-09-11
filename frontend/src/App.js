import React, { useState } from 'react';
import './App.css';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

const API_BASE = '/api/v1/students';

function App() {
  const [currentPage, setCurrentPage] = useState('list');
  const [editingStudent, setEditingStudent] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const url = editingStudent ? `${API_BASE}/${editingStudent.id}` : API_BASE;
      const method = editingStudent ? 'PUT' : 'POST';
      
      console.log('Submitting to:', url, 'Method:', method);
      
      const response = await fetch(url, {
        method,
        body: formData
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok && result.success) {
        alert('Student saved successfully!');
        setCurrentPage('list');
        setEditingStudent(null);
      } else {
        alert('Error: ' + (result.message || 'Failed to save student'));
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Network error: ' + error.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setCurrentPage('form');
  };

  const handleCancel = () => {
    setEditingStudent(null);
    setCurrentPage('list');
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🎓 Student Management System</h1>
        <nav className="nav-buttons">
          <button 
            className={`btn ${currentPage === 'list' ? 'btn-active' : 'btn-primary'}`}
            onClick={() => setCurrentPage('list')}
          >
            View Students
          </button>
          <button 
            className={`btn ${currentPage === 'form' ? 'btn-active' : 'btn-primary'}`}
            onClick={() => {
              setEditingStudent(null);
              setCurrentPage('form');
            }}
          >
            Add Student
          </button>
        </nav>
      </header>

      {currentPage === 'form' && (
        <StudentForm 
          student={editingStudent}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      {currentPage === 'list' && (
        <StudentList onEdit={handleEdit} />
      )}
    </div>
  );
}

export default App;