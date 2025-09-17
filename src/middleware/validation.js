const Joi = require('joi');

const assetSchema = Joi.object({
  asset_tag: Joi.string().min(1).max(50).required(),
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().valid('Laptop', 'Desktop', 'Server', 'Network', 'Mobile', 'Printer', 'Monitor', 'Other').required(),
  brand: Joi.string().min(1).max(50).required(),
  model: Joi.string().min(1).max(100).required(),
  serial_number: Joi.string().max(100).allow('', null),
  status: Joi.string().valid('Active', 'Inactive', 'Maintenance', 'Disposed', 'Lost').required(),
  location: Joi.string().min(1).max(100).required(),
  department: Joi.string().valid('IT', 'HR', 'Finance', 'Marketing', 'Operations', 'Management').required(),
  assigned_to: Joi.string().max(100).allow('', null),
  purchase_date: Joi.date().allow('', null),
  warranty_expiry: Joi.date().allow('', null),
  cost: Joi.number().min(0).allow('', null),
  notes: Joi.string().allow('', null)
});

const validateAsset = (req, res, next) => {
  // Convert cost to number if it's a string
  if (req.body.cost) {
    req.body.cost = parseFloat(req.body.cost);
  }
  
  const { error } = assetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = { validateAsset };