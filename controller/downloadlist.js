const DownloadList = require('../models/downloadlist');
const Expense = require('../models/expenses');


const getDownloadlist = async (req,res)=>{
    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const list = await DownloadList.find({userId: req.user.id});
        // console.log(list);
        return res.status(200).json(list)
    } 
    catch (error) {
        return res.status(500).json({succese: false, error: err})
    }
}

const getDailyExpenses = async (req, res)=>{
    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        //console.log(req.user.id)
        const today = new Date().setHours(0,0,0,0);
        const now = new Date();
        const result = await Expense.find().where('createdAt').gt(today).lt(now);
        return res.json(result);
    } 
    catch (error) {
        return res.status(500).json({succese: false, error: error})
    }  
}

const getWeeklyExpenses = async (req, res, next)=>{
    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const todayDate = new Date().getDate();
        const lastWeek  = new Date().setDate(todayDate-7);
        const now = new Date();
        const result = await Expense.find().where('createdAt').gt(lastWeek).lt(now);
        return res.json(result);
    } 
    catch (error) {
        return res.status(500).json({succese: false, error: error})
    }   
}

const getMonthlyExpenses = async (req, res, next)=>{
    try {
        if(!req.user.ispremiumuser){
            return res.status(401).json({ success: false, message: 'User is not a premium User'})
        }
        const month = new Date().getMonth()
        const lastMonth  = new Date().setMonth(month-1)
        const now = new Date()
        const result = await Expense.find().where('createdAt').gt(lastMonth).lt(now);
        return res.json(result);
    } 
    catch (error) {
        return res.status(500).json({succese: false, error: error})
    }   
}
   
module.exports = {
    getDownloadlist,
    getDailyExpenses,
    getWeeklyExpenses,
    getMonthlyExpenses
}