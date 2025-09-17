const Asset = require('../models/Asset');

const createAsset = async (req, res) => {
  try {
    const assetData = { ...req.body, image: req.file ? `/uploads/${req.file.filename}` : null };
    const asset = await Asset.create(assetData);
    res.status(201).json({ success: true, data: asset });
  } catch (error) {
    const message = error.message.includes('unique') ? 'Asset tag or serial number already exists' : 'Failed to create asset';
    res.status(error.message.includes('unique') ? 409 : 500).json({ success: false, message });
  }
};

const getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll(req.query);
    res.json({ success: true, data: assets, count: assets.length });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch assets' });
  }
};

const getAssetById = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, data: asset });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch asset' });
  }
};

const updateAsset = async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    
    const assetData = { ...req.body, image: req.file ? `/uploads/${req.file.filename}` : asset.image };
    const updatedAsset = await Asset.update(req.params.id, assetData);
    res.json({ success: true, data: updatedAsset });
  } catch (error) {
    const message = error.message.includes('unique') ? 'Asset tag or serial number already exists' : 'Failed to update asset';
    res.status(error.message.includes('unique') ? 409 : 500).json({ success: false, message });
  }
};

const deleteAsset = async (req, res) => {
  try {
    const deleted = await Asset.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Asset not found' });
    res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete asset' });
  }
};

module.exports = { createAsset, getAllAssets, getAssetById, updateAsset, deleteAsset };