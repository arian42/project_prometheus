import "./messenger.styles.scss";

const Messenger = () => (
    <div className="messenger">
        <div className="status">
            <p>Connected</p>
        </div>
        <div className="chatroom">
            <div className="msg">
                <p className="user">yolo_24</p>
                <p className="time">12:23</p>
                <p className="txt">hey! check this example layout that I created.</p>
            </div>
            <div className="msg">
                <p className="user">mark</p>
                <p className="time">12:25</p>
                <p className="txt">This css sucks. You seriously need to work on your css skill</p>
            </div>
            <div className="msg">
                <p className="user">yolo_24</p>
                <p className="time">12:25</p>
                <p className="txt">:( <br/> well that hurt </p>
            </div>
            <div className="msg">
                <p className="user">mark</p>
                <p className="time">12:26</p>
                <p className="txt">Don't forget to salt your pasta before boiling it</p>
            </div>
        </div>
        <div className="send">
            <input type="txt"></input>
            <button type="submit">send</button>
        </div>
    </div>
);

export default Messenger;