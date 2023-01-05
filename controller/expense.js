const Expense = require('../models/expenses');
const User = require('../models/users');
const S3Services  = require('../services/S3services');
const DownloadList = require('../models/downloadlist');

const ITEAM_PER_PAGE=5;

function isexpensevalid(string){
    if(string == undefined || string.length === 0){
        return true;
    }
    else{
        return false;
    }
}

const getExpense = async (req, res) => {
    try {
        const page=(+req.query.page || 1);
        // console.log(req.user.id)
        var totalCountPage;
        const expenseCount = await Expense.count({userId: req.user.id});
        totalCountPage=Math.ceil(expenseCount/ITEAM_PER_PAGE)
        // console.log(expenseCount)
        // const expenses = await Expense.findAll({where: {userId: req.user.id}});
        const expenses = await Expense.find({ userId: req.user.id }).skip((page-1)*ITEAM_PER_PAGE).limit(ITEAM_PER_PAGE)
        return res.status(200).json({expenses, pageCount:totalCountPage, succese: true});   
    } 
    catch (err) {
        return res.status(500).json({succese: false, error: err})
    }
}

const downloadexpenses = async (req, res)=>{
    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const expenses = await Expense.find({ userId: req.user.id });
        const stringifiedExpenses = JSON.stringify(expenses);
        // console.log(stringifiedExpenses);
        const userId = req.user.id;
        const date = new Date();
        const filename = `Expense${userId}/${new Date}.txt`;//filename should be unique evry time we upload file
        const fileURL  = await S3Services.uploadToS3(stringifiedExpenses, filename);
        const file = JSON.stringify(fileURL);
        await DownloadList.create({
            url:file, 
            createdAt: date, 
            userId:userId
        });

        res.status(201).json({fileURL, success: true})
        // console.log(fileURL)
    } 
    catch (error) {
        res.status(500).json({fileURL:'', success:false, error:error})
        
    }
}

const addexpense = async (req, res) => {
    try 
    {
        // console.log('123')
        const{expenseamount, description, category} = req.body;     
        if(isexpensevalid(expenseamount) || isexpensevalid(description) || isexpensevalid(category)){
            return res.status(400).json({succese: false, message: "Parameters missing"});
        }  
        const userId = req.user.id;
        const date = new Date();
        const expense = await Expense.create({
            expenseamount: expenseamount,
            description: description, 
            category: category, 
            createdAt: date,
            userId: userId});
        // const expense = await req.user.creatExpenses({expenseamount, description, category});
        return res.status(201).json({expense, succese: true});   
    } 
    catch (err) {
        return res.status(500).json({succese: false, error: err});
    }
}


const deleteexpense = async (req, res) => {
    try {
        const expenseid = req.params.expenseid;
        console.log(expenseid)
        if(isexpensevalid(expenseid))
        {
            return res.status(400).json({succese: false});
        }
        
        const noOfRows = await Expense.findByIdAndRemove(expenseid);
        if(noOfRows === 0){
            return res.status(404).json({succese: false, message: "Expense does not belongs to User"});
        }
        return res.status(200).json({succese: true, message: "Deleted Successfully"});
        
    } 
    catch (err) {
        return res.status(403).json({succese: false, message: "Failed"})
    }
}

const getUserDetails = async (req, res)=>{
    try {
 
        let user = req.user;
        // console.log(req.user.name)
        res.status(200).json({user})
    } 
    catch (err) {
        return res.status(400).json({succese: false, message: "Failed"})
    }  
}

const getExpenseById = (req,res)=>{
    const id=req.params.userId;

    Expense.find({userId:id}).then(expense=>{

        User.findById(id).then((user)=>{
            res.json({expense,name:user.name})

        }).catch(err=>{
            console.log(err)
        })

       
    }).catch(err=>{
        console.log(err)
    })

}


module.exports = {
    addexpense,
    getExpense,
    deleteexpense,
    downloadexpenses,
    getUserDetails,
    getExpenseById
}

