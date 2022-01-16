import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Login({ setIsAuth }) {
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [alert, setAlert] = useState({ visible: false, type: '', text: '' });
    const history = useHistory();

    const handleChange = event => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    };

    const login = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(loginForm),
        };
        fetch('http://localhost:8080/login', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data?.message === 'FAILED_TO_LOGIN') {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'Username or password are incorrect' });
                    return;
                }
                if (data?.message) {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'Something went wrong' });
                    return;
                }
                localStorage.setItem('token', data.token);
                setIsAuth(true);
                history.push('/');
            })
            .catch(err => {
                console.error('Something went wrong during regislogintration!');
                console.error(err);
            });
    };

    const onSubmit = event => {
        event.preventDefault();
        setAlert({ visisble: false });
        login();
    };
    return (
        <div>
            {alert.visisble ? (
                <div className={`alert ${alert.type}`} role="alert">
                    {alert.text}
                    <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={setAlert.bind({ ...alert, visisble: false })}
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            ) : null}
            <form onSubmit={onSubmit}>
                <label>
                    Username:
                    <input
                        type="text"
                        name="username"
                        value={loginForm.username}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={loginForm.password}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <input type="submit" required="required" text="Login" />
            </form>
        </div>
    );
}

export default Login;
