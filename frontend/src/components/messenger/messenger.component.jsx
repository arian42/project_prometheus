import { useState } from "react";
import "./messenger.styles.scss";

const Messenger = () => {
    
    const[messages] = useState([
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
    
    console.log(messages);

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
                    ))}
            </div> 

            <div className="send">
                <input type="txt"></input>
                <button type="submit">send</button>
            </div>
        </div>
    );
};

export default Messenger;