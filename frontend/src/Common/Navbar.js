function Navbar({ isAuth, setIsAuth }) {
    const logout = () => {
        localStorage.removeItem('token');
        setIsAuth(false);
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#e3f2fd' }}>
                <a className="navbar-brand" href="/">
                    Covid Monitoring
                </a>
                <div className="navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {!isAuth ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/login">
                                        Login
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/register">
                                        Sign up
                                    </a>
                                </li>
                            </>
                        ) : null}
                        {isAuth ? (
                            <>
                                <li className="nav-item">
                                    <a className="nav-link" href="/edit-profile">
                                        Edit profile
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" onClick={logout} href="/login">
                                        Logout
                                    </a>
                                </li>
                            </>
                        ) : null}
                    </ul>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
