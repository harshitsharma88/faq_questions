
let baseUrl = '';
baseUrl = 'http://localhost:3000';
const loginAlertText = document.getElementById('login-alert');

const loginInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

document.addEventListener('keypress', async (event) => {
    if (event.key == 'Enter') {
        if (loginInput.value.length > 0 || passwordInput.value.length > 0) {
            await loginRequest(loginInput.value, passwordInput.value);
        }
    }
});

async function staffLogin(event){
    event.preventDefault();
    const username = event.target.username.value.trim();
    const password = event.target.username.value.trim();
    if(username == '' || password == '')return alert('Please enter the required fields');
    await loginRequest(username, password);
}

async function loginRequest(userId, password){
    try {
        const { data : login} = await axios({
            method : "POST",
            url : `${baseUrl}/login`,
            data:{
                "userid" : userId,
                "password" : password
            }
        });
        if(login){
            if (login.token) {
                localStorage.setItem('token', login.token);
                window.location.href = '/home.html';
            }
        }
        else {
            loginAlertText.classList.remove('hide');
        }
    } catch (error) {
        return false;
    }
}
