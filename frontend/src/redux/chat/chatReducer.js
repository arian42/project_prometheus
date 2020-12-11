import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchChats = createAsyncThunk('chat/fetchChats', async () => {
    let fetchedChat = await fetch("http://127.0.0.1:5000/api/chat");
    let stringedChat = await fetchedChat.json();
    let listedChat = await stringedChat.map((a) => ([
        <span>{a.username}</span>,
        <span>{a.time}</span>,
        <span>{a.msg}</span>,
    ]));

    return listedChat;
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        chats: {},
        status: 'idle',
        error: null,
    },
    reducers: {

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
    }
});


export default chatSlice.reducer;

//export const {  } = chatSlice.actions;