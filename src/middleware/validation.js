const Joi = require('joi');

const studentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(16).max(100).required(),
  course: Joi.string().min(2).max(100).required(),
  level: Joi.string().valid('100', '200', '300', '400', '500').required(),
  sex: Joi.string().valid('Male', 'Female').required(),
  department: Joi.string().valid('Computer Science', 'Engineering', 'Business', 'Medicine', 'Arts', 'Science').required()
});

const validateStudent = (req, res, next) => {
  if (req.body.age) req.body.age = parseInt(req.body.age);
  const { error } = studentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = { validateStudent };