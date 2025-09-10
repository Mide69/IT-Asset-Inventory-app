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
      
      const response = await fetch(url, {
        method,
        body: formData
      });

      if (response.ok) {
        setCurrentPage('list');
        setEditingStudent(null);
      }
    } catch (error) {
      console.error('Error saving student:', error);
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