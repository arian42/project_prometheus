import { useSelector } from 'react-redux'
import { off } from '../../redux/ui/uiReducer.js';
import { useDispatch } from 'react-redux';



import './info.styles.scss';

const Info = () => {
    const dispatch = useDispatch();
    const { name, username, avatar } = useSelector(state => state.chat.currentConversation);

    return (
        <div className="setting-content">
            <div className="setting-header">
                <div className="title">info</div>
                <button className="close-btn" onClick={()=> dispatch(off('info'))}>&#10005;</button>
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
        </div>
    )
}

export default Info;