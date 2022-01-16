import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function EditProfile() {
    const [profileForm, setProfileForm] = useState({ username: '', fullName: '' });
    const [alert, setAlert] = useState({ visible: false, type: '', text: '' });
    const history = useHistory();

    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://localhost:8080/getProfile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.message === 'NOT_AUTHENTICATED') {
                    history.push('/login');
                    return;
                }
                if (data?.message) {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'Something went wrong, try again later' });
                    return;
                }
                setProfileForm(data);
            })
            .catch(err => {
                setAlert({ visisble: true, type: 'alert-danger', text: 'Something went wrong, try again later' });
            });
    }, []);

    const handleChange = event => {
        setProfileForm({ ...profileForm, [event.target.name]: event.target.value });
    };

    const updateProfile = () => {
        const token = localStorage.getItem('token');
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: 'Bearer ' + token,
            },
            body: JSON.stringify(profileForm),
        };
        fetch('http://localhost:8080/updateProfile', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data?.message === 'USERNAME_ALREADY_TAKEN') {
                    setAlert({ visisble: true, type: 'alert-danger', text: 'User with this username already exists!' });
                    return;
                }
                if (data?.message) {
                    setAlert({
                        visisble: true,
                        type: 'alert-danger',
                        text: 'Something wnet wrong, please try again later',
                    });
                    return;
                }

                setAlert({ visisble: true, type: 'alert-success', text: 'Profile updated' });
            })
            .catch(err => {
                setAlert({ visisble: true, type: 'alert-danger', text: 'Something went wrong, try again later' });
                console.error('Something went wrong when updating profile');
                console.error(err);
            });
    };

    const onSubmit = event => {
        event.preventDefault();
        setAlert({ visisble: false });
        updateProfile();
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
                        value={profileForm.username}
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
                        value={profileForm.fullName}
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

export default EditProfile;
