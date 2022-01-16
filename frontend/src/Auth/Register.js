import { useState } from 'react';
import { useHistory } from 'react-router-dom';

function Register({ setIsAuth }) {
    const [registerForm, setRegisterForm] = useState({ username: '', fullName: '', password: '', repeatPassword: '' });
    const [alert, setAlert] = useState({ visible: false, type: '', text: '' });
    const history = useHistory();

    const handleChange = event => {
        setRegisterForm({ ...registerForm, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        if (registerForm.password !== registerForm.repeatPassword) {
            setAlert({ visisble: true, type: 'alert-danger', text: 'Passwords do not match!' });
            return;
        }
    };

    const register = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(registerForm),
        };
        fetch('http://localhost:8080/register', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data?.message === 'USER_ALREADY_EXIST') {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'User with this username already exists!' });
                    return;
                }

                localStorage.setItem('token', data.token);
                setIsAuth(true);

                history.push('/');
            })
            .catch(err => {
                console.error('Something went wrong during registration!');
                console.error(err);
            });
    };

    const onSubmit = event => {
        setAlert({ visisble: false });
        validateForm();
        event.preventDefault();
        register();
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
                        value={registerForm.username}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <label>
                    Full name:
                    <input
                        type="text"
                        name="fullName"
                        value={registerForm.fullName}
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
                        value={registerForm.password}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <label>
                    Repeat password:
                    <input
                        type="password"
                        name="repeatPassword"
                        value={registerForm.repeatPassword}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <input type="submit" required="required" />
            </form>
        </div>
    );
}

export default Register;
