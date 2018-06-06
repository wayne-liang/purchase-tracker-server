var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');

// Setting up express
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8080;
// -------------------

// Setting up mongoose
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/purchase-tracker', function(err, db) {
  if (err) {
    console.log(err);
    console.log(db);
  }
});

var Purchase = require('./app/models/purchase');
// -------------------

// Setting up router
var router = express.Router();

// Testing middleware
router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
})
// -------------------

// Setting the API routes
router.route('/purchases')

  .post((req, res) => {
    var purchase = new Purchase();
    purchase.store = req.body.store;
    purchase.cost = req.body.cost;
    purchase.date = req.body.date;

    purchase.save(err => {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Purchase created!' });
    });
  })

  .get((req, res) => {
    Purchase.find((err, purchases) => {
      if (err) {
        res.send(err);
      }

      res.json(purchases);
    });
  });

router.route('/purchases/:purchase_id')

  .delete((req, res) => {
    Purchase.remove({
      _id : req.params.purchase_id
    }, (err, purchase) => {
      if (err) {
        res.send(err);
      }

      res.json({ message: 'Successfully deleted' });
    });
  });

router.route('/purchases/thisweek')

  .get((req, res) => {
    const pastMonday = new Date();
    pastMonday.setDate(pastMonday.getDate() - (pastMonday.getDay() + 6) % 7);

    const pastMondayWithoutTime = new Date(
      pastMonday.getFullYear(),
      pastMonday.getMonth(),
      pastMonday.getDate()
    );

    Purchase.find({ date: { $gte: pastMondayWithoutTime }}, (err, purchases) => {
      if (err) {
        res.send(err);
      }

      res.json(purchases);
    });
  });

router.route('/purchases/thismonth')

  .get((req, res) => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    Purchase.find({ date: { $gte: thisMonth }}, (err, purchases) => {
      if (err) {
        res.send(err);
      }

      res.json(purchases);
    });
  });
// -------------------

app.use('/api', router);
app.listen(port);

console.log('Listening on port ' + port);