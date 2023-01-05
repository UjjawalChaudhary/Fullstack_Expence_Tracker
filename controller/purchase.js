const Razorpay = require('razorpay');
const Order = require('../models/orders');
const User = require('../models/users');


const purchasepremium = async (req, res) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount, currency: "INR"}, (err, order) => {
            // console.log(order)
            if(err) {
                throw new Error(JSON.stringify(err));
            }
            // console.log('987')
            const userId = req.user.id;
            const ord = new Order({
                paymentid: null,
                orderid: order.id,
                status: 'PENDING',
                userId: userId
              });
            ord.save().then(() => {
                return res.status(201).json({ order, key_id : rzp.key_id});

            }).catch(err => {
                throw new Error(err)
            })
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Sometghing went wrong', error: err})
    }
}

 const updateTransactionStatus = async (req, res ) => {
    try {
        const userId = req.user._id;
        const name = req.user.name;
        const email = req.user.email;
        const password = req.user.password;
        // console.log(req.user)
        const { payment_id, order_id} = req.body;
        Order.findOne({orderid : order_id}).then(order => {
            order.updateOne({ paymentid: payment_id, status: 'SUCCESSFUL', userId: userId, orderid: order.id,}).then(() => {
                User.findOne({name: name}).then(user => {
                    console.log(name)
                    user.updateOne({name: name, email: email, password: password, ispremiumuser: true}).then(() => {
                        return res.status(202).json({sucess: true, message: "Transaction Successful"});
                    })
                })
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })     
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Sometghing went wrong' })

    }
}

const getAllUser = (req,res,next)=>{
    User.findAll()
    .then(users=>{
        return res.status(200).json({users,success:true})
    })
    .catch(err=>{
            console.log(err);
    })
}

module.exports = {
    purchasepremium,
    updateTransactionStatus,
    getAllUser
}