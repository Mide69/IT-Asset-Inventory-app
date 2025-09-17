import React, { useState, useEffect } from 'react';

const AssetForm = ({ onSubmit, editingAsset, onCancel }) => {
  const [formData, setFormData] = useState({
    asset_tag: '',
    name: '',
    category: '',
    brand: '',
    model: '',
    serial_number: '',
    status: 'Active',
    location: '',
    department: '',
    assigned_to: '',
    purchase_date: '',
    warranty_expiry: '',
    cost: '',
    notes: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (editingAsset) {
      setFormData({
        asset_tag: editingAsset.asset_tag || '',
        name: editingAsset.name || '',
        category: editingAsset.category || '',
        brand: editingAsset.brand || '',
        model: editingAsset.model || '',
        serial_number: editingAsset.serial_number || '',
        status: editingAsset.status || 'Active',
        location: editingAsset.location || '',
        department: editingAsset.department || '',
        assigned_to: editingAsset.assigned_to || '',
        purchase_date: editingAsset.purchase_date ? editingAsset.purchase_date.split('T')[0] : '',
        warranty_expiry: editingAsset.warranty_expiry ? editingAsset.warranty_expiry.split('T')[0] : '',
        cost: editingAsset.cost || '',
        notes: editingAsset.notes || ''
      });
    }
  }, [editingAsset]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          data.append(key, formData[key]);
        }
      });
      if (image) {
        data.append('image', image);
      }
      
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error saving asset: ' + error.message);
    }
  };

  return (
    <div className="asset-form">
      <h2>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Asset Tag *</label>
            <input
              type="text"
              name="asset_tag"
              value={formData.asset_tag}
              onChange={handleChange}
              required
              placeholder="e.g., LAP001"
            />
          </div>
          <div className="form-group">
            <label>Asset Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Dell Laptop"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Server">Server</option>
              <option value="Network">Network</option>
              <option value="Mobile">Mobile</option>
              <option value="Printer">Printer</option>
              <option value="Monitor">Monitor</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Disposed">Disposed</option>
              <option value="Lost">Lost</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Brand *</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              required
              placeholder="e.g., Dell, HP, Cisco"
            />
          </div>
          <div className="form-group">
            <label>Model *</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
              placeholder="e.g., Latitude 7420"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number}
              onChange={handleChange}
              placeholder="Device serial number"
            />
          </div>
          <div className="form-group">
            <label>Cost</label>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Office Floor 2, Room 201"
            />
          </div>
          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
              <option value="Management">Management</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Assigned To</label>
            <input
              type="text"
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              placeholder="Employee name or ID"
            />
          </div>
          <div className="form-group">
            <label>Asset Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Purchase Date</label>
            <input
              type="date"
              name="purchase_date"
              value={formData.purchase_date}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Warranty Expiry</label>
            <input
              type="date"
              name="warranty_expiry"
              value={formData.warranty_expiry}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Additional notes about the asset..."
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {editingAsset ? 'Update Asset' : 'Create Asset'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetForm;