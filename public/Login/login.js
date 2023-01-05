const url = 'http://localhost'
// const url ='http://52.66.252.234'

async function login(e)
{
    try 
    {
        e.preventDefault();
        const loginDetails = {
            email: e.target.email.value,
            password: e.target.password.value
        }
        e.target.email.value = '';
        e.target.password.value= '';
        const respone = await axios.post(`${url}:3000/user/login`, loginDetails);
        // console.log(respone.data.token);
        alert(respone.data.message);
        localStorage.setItem('token', respone.data.token)
        window.location.href = "../ExpenseTracker/index.html";
    }
    catch (err) 
    {
        console.log(JSON.stringify(err))
        document.body.innerHTML += `<div style="color:red;">${err.message}<div>`;
    }
}

function forgotpassword() {
    window.location.href = "../ForgotPassword/password.html"
}
