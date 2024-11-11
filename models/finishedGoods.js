const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    finishedGoodsName : {
        type: String,
      },
      batchNumber: {
        type: String,
      },
      productionDate: {
        type: Date,
      }, quantityProduced: {
          type: String,
        },
 
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'Admin' },
  assigned: { type: mongoose.Schema.ObjectId, ref: 'Admin' },

  removed: {
    type: Boolean,
    default: false,
  },
});

schema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('FinishedGoods', schema);
