import { useState, useEffect } from "react";
import { useSelector } from 'react-redux'
import { useHistory } from "react-router-dom";
import "./chat.styles.scss";

const Chat = () => {
    const [render,rerender] = useState({});
    const [message, setMessage] = useState("");
    const[chat, setChat] = useState([]);
    const token = useSelector( state => state.user.token );

    let history = useHistory();

    useEffect(() => {
        
        let fetchingChat = async () => {

            if (!token) {
                history.push('/someRoute');
                return;
            }

            let fetchedChat = await fetch("http://127.0.0.1:5000/api/chat", {
                headers: {
                    'x-access-token': `${token}`
                },
            });
            let stringedChat = await fetchedChat.json();
            let listedChat = await stringedChat.map((a) => ([
                <span>{a.username}</span>,
                <span>{a.time}</span>,
                <span>{a.msg}</span>,
            ]));

            //I don't know why the first message sent from server is empty so I simply shift it
            listedChat.shift();

            setChat([...listedChat]);
        };

        fetchingChat();

        const intervalId = setInterval(() => {
            fetchingChat();
        }, 1000);

        return () => clearInterval(intervalId);

    }, [render, token, history]);

    const handleChange = event => {
        setMessage(event.target.value);
    }

    const sendMessage = async event => {
        event.preventDefault();

        if (message === "" ) {
            return;
        }

        let messageJSON = {
            "msg": `${message}`,
        }
        
        fetch("http://127.0.0.1:5000/api/chat",{
            headers: {
                'x-access-token': `${token}`
            },
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