import React, { useState, useEffect } from 'react';

const AssetList = ({ onEdit, onDelete }) => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: '',
    department: '',
    location: ''
  });

  const fetchAssets = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });
      
      const response = await fetch(`/api/v1/assets?${queryParams}`);
      const result = await response.json();
      
      if (result.success) {
        setAssets(result.data);
      } else {
        console.error('Failed to fetch assets:', result.message);
      }
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading assets...</div>;
  }

  return (
    <div>
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search assets..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Laptop">Laptop</option>
          <option value="Desktop">Desktop</option>
          <option value="Server">Server</option>
          <option value="Network">Network</option>
          <option value="Mobile">Mobile</option>
          <option value="Printer">Printer</option>
          <option value="Monitor">Monitor</option>
          <option value="Other">Other</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Disposed">Disposed</option>
          <option value="Lost">Lost</option>
        </select>
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange('department', e.target.value)}
        >
          <option value="">All Departments</option>
          <option value="IT">IT</option>
          <option value="HR">HR</option>
          <option value="Finance">Finance</option>
          <option value="Marketing">Marketing</option>
          <option value="Operations">Operations</option>
          <option value="Management">Management</option>
        </select>
        <input
          type="text"
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
      </div>

      {assets.length === 0 ? (
        <div className="no-assets">
          <h3>No assets found</h3>
          <p>Try adjusting your search filters or add a new asset.</p>
        </div>
      ) : (
        <div className="asset-list">
          {assets.map(asset => (
            <div key={asset.id} className="asset-card">
              <div className="asset-header">
                <span className="asset-tag">{asset.asset_tag}</span>
                <span className={getStatusClass(asset.status)}>{asset.status}</span>
              </div>
              
              {asset.image && (
                <img 
                  src={asset.image} 
                  alt={asset.name}
                  className="asset-image"
                />
              )}
              
              <div className="asset-info">
                <h3>{asset.name}</h3>
                <p><strong>Category:</strong> <span className="highlight">{asset.category}</span></p>
                <p><strong>Brand:</strong> {asset.brand}</p>
                <p><strong>Model:</strong> {asset.model}</p>
                {asset.serial_number && <p><strong>Serial:</strong> {asset.serial_number}</p>}
                <p><strong>Location:</strong> {asset.location}</p>
                <p><strong>Department:</strong> {asset.department}</p>
                {asset.assigned_to && <p><strong>Assigned to:</strong> {asset.assigned_to}</p>}
                {asset.cost && <p><strong>Cost:</strong> {formatCurrency(asset.cost)}</p>}
                {asset.warranty_expiry && (
                  <p><strong>Warranty:</strong> {formatDate(asset.warranty_expiry)}</p>
                )}
                {asset.notes && <p><strong>Notes:</strong> {asset.notes}</p>}
              </div>
              
              <div className="asset-actions">
                <button 
                  className="btn btn-edit"
                  onClick={() => onEdit(asset)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-delete"
                  onClick={() => onDelete(asset.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssetList;