const dotnev = require('dotenv');
dotnev.config();

const  cors = require('cors');
const mongoose = require('mongoose');
const express = require('express');


// const Expense = require('./models/expenses');
// const Order = require('./models/orders');
// const User = require('./models/users');
// const Forgotpassword = require('./models/forgotpassword');
// const Downloadlist=require('./models/downloadlist')


const app = express();
app.use(cors());

const userRoutes = require('./routes/user')
const purchaseRoutes = require('./routes/purchase')
const expenseRoutes = require('./routes/expense')
const resetPasswordRoutes = require('./routes/resetpassword')
const downloadlistRoutes=require('./routes/downloadlist')

app.use(express.json());

app.use('/user', userRoutes)
app.use('/purchase', purchaseRoutes)
app.use('/expense', expenseRoutes)
app.use('/password', resetPasswordRoutes);
app.use('/downloadlist', downloadlistRoutes)

mongoose
.connect(
  process.env.DB_DETAILS
)
.then(() => {
  app.listen(3000);
})
.catch(error => {
  console.log(error)
})