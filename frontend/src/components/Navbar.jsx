import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="nav-brand">TaskMgr</div>
            {user && (
                <button className="btn btn-outline" onClick={logout}>
                    Logout
                </button>
            )}
        </nav>
    );
};

export default Navbar;
