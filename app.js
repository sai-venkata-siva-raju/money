const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/moneyTrackerDB', { useNewUrlParser: true, useUnifiedTopology: true });
const transactionSchema = new mongoose.Schema({
    type: String,
    amount: Number,
    timestamp: { type: Date, default: Date.now }
});
const Transaction = mongoose.model('Transaction', transactionSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/addTransaction', (req, res) => {
    const newTransaction = new Transaction({
        type: req.body.type,
        amount: req.body.amount
    });

    newTransaction.save((err) => {
        if (err) {
            console.error(err);
            res.send('Error adding transaction.');
        } else {
            res.redirect('/');
        }
    });
});

app.get('/getTransactions', (req, res) => {
    Transaction.find({}, (err, transactions) => {
        if (err) {
            console.error(err);
            res.send('Error fetching transactions.');
        } else {
            res.json(transactions);
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
