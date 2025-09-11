import React, { useState } from 'react';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: student?.name || '',
    email: student?.email || '',
    age: student?.age || '',
    course: student?.course || '',
    level: student?.level || '',
    sex: student?.sex || '',
    department: student?.department || ''
  });
  const [picture, setPicture] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      if (picture) {
        data.append('picture', picture);
      }
      
      // Debug: log form data
      console.log('Form data:', Object.fromEntries(data));
      
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error creating student: ' + error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>{student ? 'Edit Student' : 'Add New Student'}</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({...formData, age: e.target.value})}
          required
          min="16"
          max="100"
        />
        <input
          type="text"
          placeholder="Course"
          value={formData.course}
          onChange={(e) => setFormData({...formData, course: e.target.value})}
          required
        />
        <select
          value={formData.level}
          onChange={(e) => setFormData({...formData, level: e.target.value})}
          required
        >
          <option value="">Select Level</option>
          <option value="100">100 Level</option>
          <option value="200">200 Level</option>
          <option value="300">300 Level</option>
          <option value="400">400 Level</option>
          <option value="500">500 Level</option>
        </select>
        <select
          value={formData.sex}
          onChange={(e) => setFormData({...formData, sex: e.target.value})}
          required
        >
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select
          value={formData.department}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
          required
        >
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Engineering">Engineering</option>
          <option value="Business">Business</option>
          <option value="Medicine">Medicine</option>
          <option value="Arts">Arts</option>
          <option value="Science">Science</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPicture(e.target.files[0])}
          className="file-input"
        />
        <div className="form-actions">
          <button type="submit" className="btn btn-success">
            {student ? 'Update' : 'Create'} Student
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;