import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
//import { io } from 'socket.io-client';

export const fetchChats = createAsyncThunk('chat/fetchChats', async (username, { getState }) => {
    const {token} = getState().user;
    
    let fetchedChat = await fetch(`http://87.236.212.125/api/chat/${username}`, {
        headers: {
            'x-access-token': `${token}`
        },
    });
    let stringedChat = await fetchedChat.json();
    let listedChat = await stringedChat;

    return listedChat;
});

export const sendMessage = createAsyncThunk('chat/sendMessage', async ({currentConversation, message}, { getState }) => {
    const {token} = getState().user;

    let messageJSON = {
        "msg": `${message}`,
    }

    fetch(`http://87.236.212.125/api/chat/${currentConversation}`,{
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

export const fetchChatsList = createAsyncThunk('chat/fetchChatsList', async (_, { getState }) => {
    const {token} = getState().user;

    let fetchedChat = await fetch("http://87.236.212.125/api/chats", {
        headers: {
            'x-access-token': `${token}`
        },
    });

    let stringedChat = await fetchedChat.json();

    return stringedChat;
});

export const profileSearch = createAsyncThunk('user/profileSearch', async (person, { getState } ) => {
    const {token} = getState().user;

    const fetchedJson = await fetch("http://87.236.212.125/api/search",{
        method: 'POST',
        body: JSON.stringify({
            'username': `${person}`,
            'token': `${token}`,
        })
    });

    const fetchedData = await fetchedJson.json();

    return fetchedData;
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chatsList: [],
        currentConversation: {
            name: null,
            username: null,
            avatar: null,
        },
        chats: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // update(state, action) {
        //     if(action.payload !== null) {
        //         state.chatsList = [...state.chatsList, ...action.payload.chatsList];
        //         state.chats = [...state.chats, ...action.payload.chats];
        //     }else{
        //         state.status = "chatSocket worked"
        //     }
        // },
        setConversation(state, action) {
            state.currentConversation = {
                name: action.payload.name,
                username: action.payload.username,
                avatar: action.payload.avatar,
            }
        },
        nullChatsList(state) {
            state.chatsList = [];
        }
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
        [profileSearch.pending]: (state, _action) => {
            state.status = 'loading';
        },
        [profileSearch.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.chatsList = action.payload;
        },
        [profileSearch.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});


export default chatSlice.reducer;

export const { setConversation, nullChatsList } = chatSlice.actions;