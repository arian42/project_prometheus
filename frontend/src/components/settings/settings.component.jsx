import { useSelector } from 'react-redux'
import { off } from '../../redux/ui/uiReducer.js';
import { signOut } from '../../redux/user/userReducer.js'
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";


import './settings.styles.scss';

const Settings = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { name, username, avatar } = useSelector(state => state.user.profile);

    return (
        <div className="setting-content">

            <div className="setting-header">
                <div className="title">Settings</div>
                <button className="close-btn" onClick={()=> dispatch(off('settings'))}>x</button>
            </div>

            <div className="setting-info">
                <div className="profile-pic">
                    <img src={avatar} alt="profile"/>
                </div>
                <div className="username-and-name">
                    <div>
                        <span>Name</span>
                        <p>{name}</p>
                    </div>
                    <div>
                        <span>Username</span>
                        <p>@{username}</p>
                    </div>
                </div>
            </div>

            <button className="signout-btn" onClick={
                ()=>{
                    dispatch(signOut());
                    history.push("/login");
                }
            }>sign out</button>
        </div>
    )
}

export default Settings;