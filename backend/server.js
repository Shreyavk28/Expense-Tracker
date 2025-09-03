const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const transactionSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  type: { type: String, enum: ["income", "expense"] },
  category: String,
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes
app.get("/api/transactions", async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.post("/api/transactions", async (req, res) => {
  const newTransaction = new Transaction({
    title: req.body.title,
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
  });
  await newTransaction.save();
  res.json(newTransaction);
});



app.delete("/api/transactions/:id", async (req, res) => {
  await Transaction.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
