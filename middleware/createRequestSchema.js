const Joi = require('joi');

const tomorrow = new Date();
tomorrow.setHours(0, 0, 0, 0); // Set to today at 00:00:00
tomorrow.setDate(tomorrow.getDate() + 1); // Move to tomorrow

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

  requiredDate: Joi.date().greater(tomorrow).required(), // 👈 Date must be greater than today (i.e., tomorrow or later)

  finishedGoodsName: Joi.string().required(),

  status: Joi.string().valid('Pending', 'Approved', 'Rejected', 'Completed', 'Assigned')
});

module.exports = { createRequestSchema };
