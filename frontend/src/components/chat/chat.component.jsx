import { useState, useEffect } from "react";
import "./chat.styles.scss";

let date = new Date();

const Chat = () => {
    const [render,rerender] = useState({});
    const [message, setMessage] = useState("");
    const[chat, setChat] = useState([]);

    useEffect(() => {

        let fetchingChat = async () => {
            let fetchedChat = await fetch("http://127.0.0.1:5000/api/chat");
            let stringedChat = await fetchedChat.json();
            let listedChat = await stringedChat.map((a) => ([
                <span>{a.user}</span>,
                <span>{a.time}</span>,
                <span>{a.msg}</span>,
            ]));

            setChat([...listedChat]);
        };

        fetchingChat();

        const intervalId = setInterval(() => {
            fetchingChat();
        }, 1000);

        return () => clearInterval(intervalId);

    }, [render]);

    const handleChange = event => {
        setMessage(event.target.value);
    }

    const sendMessage = async event => {
        event.preventDefault();

        if (message === "" ) {
            return;
        }

        let messageJSON = {
            "user" : "mark",
            "msg": `${message}`,
            "time": `${date.getHours() + ":" + date.getMinutes + "" + date.getSeconds()}`,
        }
        
        fetch("http://127.0.0.1:5000/api/chat",{
            method: 'post',
            body: JSON.stringify(messageJSON)
        })

        setMessage("");
        rerender({});
    }

    return(
        <div className="messenger">
            <div className="status">
                <p>Connected</p>
            </div>
            <div className="chatroom">
                {chat
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
                    label="message"
                ></input>
                <button type="submit">send</button>
            </form>
        </div>
    );
};

export default Chat;