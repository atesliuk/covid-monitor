import ChangePassword from './ChangePassword';
import EditProfile from './EditProfile';

function Profile() {
    return (
        <div>
            <EditProfile />
            <br />
            <ChangePassword />
        </div>
    );
}

export default Profile;
