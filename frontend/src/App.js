import React, { useState } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import './App.css';

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

      const result = await response.json();

      if (response.ok && result.success) {
        alert(editingStudent ? 'Student updated successfully!' : 'Student created successfully!');
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert('Student deleted successfully!');
          // Refresh the list by switching pages
          setCurrentPage('form');
          setTimeout(() => setCurrentPage('list'), 100);
        } else {
          alert('Error: ' + (result.message || 'Failed to delete student'));
        }
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Network error: ' + error.message);
      }
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>🎓 Student Management System</h1>
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentPage('list')}
            className={currentPage === 'list' ? 'active' : ''}
          >
            📋 Student List
          </button>
          <button 
            onClick={() => {
              setEditingStudent(null);
              setCurrentPage('form');
            }}
            className={currentPage === 'form' ? 'active' : ''}
          >
            ➕ Add Student
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'list' ? (
          <StudentList onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <StudentForm 
            onSubmit={handleSubmit}
            editingStudent={editingStudent}
            onCancel={() => {
              setEditingStudent(null);
              setCurrentPage('list');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;