const formDOM = document.querySelector('.form');
const usernameInputDOM = document.querySelector('.username-input');
const passwordInputDOM = document.querySelector('.password-input');
const formAlertDOM = document.querySelector('.form-alert');
const resultDOM = document.querySelector('.result');
const btnDOM = document.querySelector('#data');
const tokenDOM = document.querySelector('.token');

// Get the popup element
const popup = document.getElementById('popup');
const openPopupButton = document.getElementById('open-popup');
const closePopupButton = document.getElementById('close-popup');

// Function to open the popup
const openPopup = () => {
    popup.style.display = 'block';
};

// Function to close the popup
const closePopup = () => {
    popup.style.display = 'none';
};

// Event listener for opening the popup
openPopupButton.addEventListener('click', openPopup);

// Event listener for closing the popup
closePopupButton.addEventListener('click', closePopup);

// Close the popup if the user clicks anywhere outside of the popup
window.addEventListener('click', (event) => {
    if (event.target === popup) {
        closePopup();
    }
});

formDOM.addEventListener('submit', async (e) => {
    formAlertDOM.classList.remove('text-success');
    tokenDOM.classList.remove('text-success');

    e.preventDefault();
    const username = usernameInputDOM.value;
    const password = passwordInputDOM.value;

    try {
        const {data} = await axios.post('/api/v1/login', {username, password});

        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = data.msg;

        formAlertDOM.classList.add('text-success');
        usernameInputDOM.value = '';
        passwordInputDOM.value = '';

        localStorage.setItem('token', data.token);
        resultDOM.innerHTML = '';
        tokenDOM.textContent = 'token present';
        tokenDOM.classList.add('text-success');
    } catch (error) {
        formAlertDOM.style.display = 'block';
        formAlertDOM.textContent = 'You logged before';
        localStorage.removeItem('token');
        resultDOM.innerHTML = '';
        tokenDOM.textContent = 'no token present';
        tokenDOM.classList.remove('text-success');
    }
    setTimeout(() => {
        formAlertDOM.style.display = 'none';
    }, 5000);
});

btnDOM.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    try {
        const {data} = await axios.get('/api/v1/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        resultDOM.innerHTML = `<h5>${data.msg}</h5><p>${data.secret}</p>`;

        data.secret;
    } catch (error) {
        localStorage.removeItem('token');
        resultDOM.innerHTML = `<p>${error.response.data.msg}</p>`;
    }
});

const checkToken = () => {
    tokenDOM.classList.remove('text-success');

    const token = localStorage.getItem('token');
    if (token) {
        tokenDOM.textContent = 'token present';
        tokenDOM.classList.add('text-success');
    }
};
checkToken();
