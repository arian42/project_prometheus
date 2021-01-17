import { Fragment } from 'react';
import ConversationList from '../ConversationList';
import MessageList from '../MessageList';
import Settings from '../../settings/settings.component.jsx';

import { useSelector } from 'react-redux';

import './Messenger.css';

export default function Messenger(props) {
  const settings = useSelector(state => state.ui.settings);

  return (
    <div className="messenger">
      {/* <Toolbar
        title="Messenger"
        leftItems={[
          <ToolbarButton key="cog" icon="ion-ios-cog" />
        ]}
        rightItems={[
          <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
        ]}
      /> */}

      {/* <Toolbar
        title="Conversation Title"
        rightItems={[
          <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
          <ToolbarButton key="video" icon="ion-ios-videocam" />,
          <ToolbarButton key="phone" icon="ion-ios-call" />
        ]}
      /> */}

      <div className="scrollable sidebar">
        <ConversationList />
      </div>

      <div className="scrollable content">
        <MessageList />
      </div>
      {
        settings 
          ?
        <div className="setting-container">
          <Settings />
        </div>
        :
        <Fragment></Fragment>
      }
    </div>
  );
}