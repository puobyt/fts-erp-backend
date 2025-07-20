const Joi = require('joi');

const createRequestSchema = Joi.object({
  requestNumber: Joi.string().allow(null, '').optional(),
  materials: Joi.array().items(
    Joi.object({
      materialsList: Joi.string().required(),
      quantity: Joi.number().positive().required(),
      unit: Joi.string().valid('KG', 'Gram', 'Litre', 'ML', 'Pieces').required(),
      materialCode: Joi.string().required()
    })
  ).min(1).required(),
  requiredDate: Joi.date().iso().greater('now').required(),
  finishedGoodsName: Joi.string().required(),
  status: Joi.string().valid('Pending', 'Approved', 'Rejected', 'Completed', 'Assigned')
});

module.exports = { createRequestSchema };