var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PurchaseSchema = new Schema({
  store: String,
  cost: Schema.Types.Decimal128,
  date: Date
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
