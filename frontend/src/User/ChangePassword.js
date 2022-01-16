import { useState } from 'react';

function ChangePassword() {
    const [changePasswordForm, setChangePasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        repeatedNewPassword: '',
    });
    const [alert, setAlert] = useState({ visible: false, type: '', text: '' });

    const isValid = () => {
        if (changePasswordForm.newPassword !== changePasswordForm.repeatedNewPassword) {
            setAlert({
                visisble: true,
                type: 'alert-danger',
                text: "New password doesn't match repeated new password",
            });
            return false;
        }
        if (changePasswordForm.oldPassword === changePasswordForm.newPassword) {
            setAlert({ visisble: true, type: 'alert-danger', text: 'New password should differ from the old one!' });
            return false;
        }
        return true;
    };

    const changePassword = () => {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(changePasswordForm),
        };
        fetch('http://localhost:8080/changePassword', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data?.message === 'INVALID_OLD_PASSWORD') {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'Invalid old password' });
                    return;
                }
                if (data?.message) {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'Something went wrong, try again later' });
                    return;
                }

                setAlert({ visisble: true, type: 'alert-success', text: 'Password changed successfully' });
                setChangePasswordForm({ oldPassword: '', newPassword: '', repeatedNewPassword: '' });
            })
            .catch(err => {
                setAlert({ visisble: true, type: 'alert-danger', text: 'Something went wrong, try again later' });
                console.error('Something went wrong during password change');
                console.error(err);
            });
    };

    const onSubmit = event => {
        event.preventDefault();
        setAlert({ visisble: false });
        if (isValid()) {
            changePassword();
        }
    };

    const handleChange = event => {
        setChangePasswordForm({ ...changePasswordForm, [event.target.name]: event.target.value });
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
                    Old password:
                    <input
                        type="password"
                        name="oldPassword"
                        value={changePasswordForm.oldPassword}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <label>
                    New password:
                    <input
                        type="password"
                        name="newPassword"
                        value={changePasswordForm.newPassword}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <label>
                    Repeat new password:
                    <input
                        type="password"
                        name="repeatedNewPassword"
                        value={changePasswordForm.repeatedNewPassword}
                        onChange={handleChange}
                        required="required"
                    />
                </label>
                <br />
                <input type="submit" required="required" text="Change password" />
            </form>
        </div>
    );
}

export default ChangePassword;
