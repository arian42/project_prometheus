import Chat from '../../components/chat/chat.component';

import ConversationList from '../../components/experimental/ConversationList/index';

import './messenger.styles.scss';

const Messenger = () => {
    return(
        <div className="App">
            <div className="scrollable sidebar">
                <ConversationList />
            </div>
            <Chat/>
        </div>
    );
}

export default Messenger;