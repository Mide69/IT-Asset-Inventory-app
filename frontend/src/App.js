import React, { useState } from 'react';
import AssetList from './components/AssetList';
import AssetForm from './components/AssetForm';
import './App.css';

const API_BASE = '/api/v1/assets';

function App() {
  const [currentPage, setCurrentPage] = useState('list');
  const [editingAsset, setEditingAsset] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      const url = editingAsset ? `${API_BASE}/${editingAsset.id}` : API_BASE;
      const method = editingAsset ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(editingAsset ? 'Asset updated successfully!' : 'Asset created successfully!');
        setCurrentPage('list');
        setEditingAsset(null);
      } else {
        alert('Error: ' + (result.message || 'Failed to save asset'));
        if (result.errors) {
          console.error('Validation errors:', result.errors);
        }
      }
    } catch (error) {
      console.error('Error saving asset:', error);
      alert('Network error: ' + error.message);
    }
  };

  const handleEdit = (asset) => {
    setEditingAsset(asset);
    setCurrentPage('form');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.success) {
          alert('Asset deleted successfully!');
          // Refresh the list by switching pages
          setCurrentPage('form');
          setTimeout(() => setCurrentPage('list'), 100);
        } else {
          alert('Error: ' + (result.message || 'Failed to delete asset'));
        }
      } catch (error) {
        console.error('Error deleting asset:', error);
        alert('Network error: ' + error.message);
      }
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>💻 IT Asset Inventory System</h1>
        <div className="nav-buttons">
          <button 
            onClick={() => setCurrentPage('list')}
            className={currentPage === 'list' ? 'active' : ''}
          >
            📋 Asset List
          </button>
          <button 
            onClick={() => {
              setEditingAsset(null);
              setCurrentPage('form');
            }}
            className={currentPage === 'form' ? 'active' : ''}
          >
            ➕ Add Asset
          </button>
        </div>
      </nav>

      <main className="main-content">
        {currentPage === 'list' ? (
          <AssetList onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <AssetForm 
            onSubmit={handleSubmit}
            editingAsset={editingAsset}
            onCancel={() => {
              setEditingAsset(null);
              setCurrentPage('list');
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;