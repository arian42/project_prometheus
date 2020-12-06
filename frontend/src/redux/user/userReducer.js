import { 
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

export const signUp = createAsyncThunk('user/signUp', async ({name, username, email, password }) => {

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/sign-up",{
        method: 'post',
        body: JSON.stringify({
            'name': `${name}`,
            'username': `${username}`,
            'email': `${email}`,
            'password': `${password}`
        })
    });

    const fetchedData = await fetchedJson.json();

    return fetchedData;   
});

export const signIn = createAsyncThunk('user/signIn', async ({usernameOrEmail, password}) => {

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/sign-in",{
        method: 'post',
        body: JSON.stringify({
            'usernameOrEmail': `${usernameOrEmail}`,
            'password': `${password}`,
        })
    });

    const fetchedData = await fetchedJson.json();

    return fetchedData;
});

export const profile = createAsyncThunk('user/profile', async ({username, token}, a) => {
    const fetchedJson = await fetch("http://127.0.0.1:5000/api/sign-up",{
        method: 'GET',
        body: JSON.stringify({
            'username': `${username}`,
            'token': `${token}`,
        })
    });

    console.log(a);

});



const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null,
        profile: {
            name: null,
            username: null,
            email: null,
            avatar: null,
        },
        status: 'idle',
        error: null,
    },
    reducers: {
        signOut(state, _action) {
            state.token = null;
            state.name = null;
            state.phoneToken = null;
            state.status = 'idle';
        },
    },
    extraReducers: {
        [signUp.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [signUp.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.profile.username = action.payload.username;
            state.token = action.payload.token;
        },
        [signUp.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [signIn.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [signIn.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.profile.username = action.payload.username;
            state.token = action.payload.token;
        },
        [signIn.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        // [profile.pending]: (state, _action) => {
        //     state.status = 'loading'
        // },
        // [profile.fulfilled]: (state, action) => {
        //     state.status = 'succeeded';
        //     state.profile = action.payload;
        // },
        // [profile.rejected]: (state, action) => {
        //     state.status = 'failed';
        //     state.error = action.error.message;
        // },
    }
});


export default userSlice.reducer;

export const { signOut } = userSlice.actions;