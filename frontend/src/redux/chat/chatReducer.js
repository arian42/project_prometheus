import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import { io } from 'socket.io-client';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (user) => {
    let fetchedChat = await fetch(`http://127.0.0.1:5000/api/chat/${user}`);
    let stringedChat = await fetchedChat.json();
    let listedChat = await stringedChat;

    //I don't know why the first message sent from server is empty so I simply shift it
    listedChat.shift();

    return listedChat;
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async (message, { getState }) => {
    const {token} = getState().user;

    let messageJSON = {
        "msg": `${message}`,
    }

    fetch("http://127.0.0.1:5000/api/chat",{
        headers: {
            'x-access-token': `${token}`
        },
        method: 'post',
        body: JSON.stringify(messageJSON)
    });
});

// export const socketChat = createAsyncThunk('chat/socketChat', async (_, { dispatch, getState }) => {
//     const {token} = getState().user;

//     let server = `http://localhost:5000/socket/${token}`;

//     const socket = io(server);

//     dispatch({
//         type: "chat/update",
//         payload: null,
//     });

//     socket.on("update", updates => {
//         dispatch({
//             type: "chat/update",
//             payload: updates,
//         });
//     });
// });

export const fetchChatsList = createAsyncThunk('chat/fetchChatsList', async (_, { dispatch, getState }) => {
    const {token} = getState().user;

    let fetchedChat = await fetch("http://127.0.0.1:5000/api/chats", {
        headers: {
            'x-access-token': `${token}`
        },
    });

    let stringedChat = await fetchedChat.json();

    return stringedChat;
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatsList: [],
        chats: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        update(state, action) {
            if(action.payload !== null) {
                state.chatsList = [...state.chatsList, ...action.payload.chatsList];
                state.chats = [...state.chats, ...action.payload.chats];
            }else{
                state.status = "chatSocket worked"
            }
        },
    },
    extraReducers: {
        [fetchChats.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchChats.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.chats = action.payload;
        },
        [fetchChats.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [fetchChatsList.pending]: (state, action) => {
            state.status = 'loading'
        },
        [fetchChatsList.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.chatsList = action.payload;
        },
        [fetchChatsList.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        // [socketChat.pending]: (state, action) => {
        // },
        // [socketChat.fulfilled]: (state, action) => {
        // },
        // [socketChat.rejected]: (state, action) => {
        // },
    }
});


export default chatSlice.reducer;

//export const {  } = chatSlice.actions;