import { useState } from "react";
import "./messenger.styles.scss";

const Messenger = () => {
    
    const[messages, setMessages] = useState([
        [
            <span>yolo_24</span>,
            <span>12:23</span>,
            <span>hey! check this example layout that I created.</span>
        ],
        [
            <span>mark</span>,
            <span>12:25</span>,
            <span>This css sucks. You seriously need to work on your css skill</span>
        ],
        [
            <span>yolo_24</span>,
            <span>12:25</span>,
            <span>&#128542;&#128542;&#128542;<br/> well that hurt</span>
        ],
        [
            <span>mark</span>,
            <span>12:26</span>,
            <span>Don't forget to salt your pasta before boiling it</span>
        ],
    ]);

    const [message, setMessage] = useState("");

    const handleChange = event => {
        setMessage(event.target.value);
    }

    const sendMessage = async event => {
        event.preventDefault();

        setMessages([
            ...messages,
            [
                <span>mark</span>,
                <span>don't have any yet</span>,
                <span>{message}</span>
            ]
        ]);

        setMessage("");
    }

    return(
        <div className="messenger">
            <div className="status">
                <p>Connected</p>
            </div>
            <div className="chatroom">
                {messages
                    .map((a,index) => (
                        <div className="msg" key={index}>
                            <p className="user">{a[0]}</p>
                            <p className="time">{a[1]}</p>
                            <p className="txt">{a[2]}</p>
                        </div>
                    ))
                }
            </div> 

            <form className="send" onSubmit={sendMessage}>
                <input
                    type="txt"
                    onChange={handleChange}
                    value={message}
                    placeholder="write your message"
                ></input>
                <button type="submit">send</button>
            </form>
        </div>
    );
};

export default Messenger;