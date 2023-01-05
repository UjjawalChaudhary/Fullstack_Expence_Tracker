const User = require('../models/users');
const Expense = require('../models/expenses');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isstringinvalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

const signup = async (req, res) => {
    try 
    {
        const{name, email, password} = req.body;
        // console.log(name)

        if(isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)){
            return res.status(400).json({err: "Bad parameters. Something is missing"});
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async(err, hash) => {
            const user = new User({
                name: name,
                email: email,
                password: hash,
                ispremiumuser: false
              });
            await user.save();
            res.status(201).json({message: 'Successfully created new user'});
        })
    } 
    catch (error) {
        res.status(500).json(error);
    }
}

function generateAccessToken(id, name){
    return jwt.sign({userId: id, name: name}, process.env.TOKEN_SECRET)
}

const login = async (req, res) => {
    try 
    {
        const {email, password} = req.body;
        if(isstringinvalid(email) || isstringinvalid(password))
        {
            return res.status(400).json({message: 'Email id or password is missing', success: false});
        }
        
        const user = await User.find({ email: email})
        console.log('123')
        console.log(user[0].password)
        if(user.length > 0){
            bcrypt.compare(password, user[0].password, (err, result) => {
                if(err){
                    throw new Error('Something went wrong')
                }
                if(result){
                    return res.status(200).json({success: true, message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name)})
                }
                else{
                    return  res.status(400).json({message: 'Password is incorrect', success: false});
                }
            })
        }
        else{
            return  res.status(404).json({message: 'User does not exist', success: false});
        }
    } 
    catch (err) {
        res.status(500).json({message: err, success: false});
    }
}

const getAllUserWithExpense = async(req,res)=>{
    if(!req.user.ispremiumuser){
        return res.status(401).json({ success: false, message: 'User is not a premium User'})
    }
    User.find().then(async(users)=>{
      var UserAndExpense=[]
      var alldata={};
      for(let i=0;i<users.length;i++){
      await  Expense.find({userId:users[i].id}).then(expense=>{
        var totalexpense=0;
        for(let i=0;i<expense.length;i++){
          totalexpense=totalexpense+expense[i].expenseamount
        }
          alldata={
            ...users[i],
            totalexpense
          }
        //   console.log(alldata);
        })
        UserAndExpense.push(alldata)
      }
    //   console.log(UserAndExpense)
      res.json(UserAndExpense) 
    })
  }

  

module.exports = {
    signup,
    login,
    getAllUserWithExpense
}

