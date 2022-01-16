import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Register from './Auth/Register';
import Login from './Auth/Login';
import Navbar from './Common/Navbar';
import Profile from './User/Profile';
import MainScreen from './CovidData/MainScreen';

function App() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        setIsAuth(true);
    }, []);

    return (
        <>
            <Navbar isAuth={isAuth} setIsAuth={setIsAuth} />
            <Router>
                <Switch>
                    <Route path="/login">
                        <Login setIsAuth={setIsAuth} />
                    </Route>
                    <Route path="/register">
                        <Register setIsAuth={setIsAuth} />
                    </Route>
                    <Route path="/edit-profile">
                        <Profile />
                    </Route>
                    <Route path="/">
                        <MainScreen />
                    </Route>
                </Switch>
            </Router>
        </>
    );
}

export default App;
