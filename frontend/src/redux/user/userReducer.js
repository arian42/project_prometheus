import { 
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';

export const signUp = createAsyncThunk('user/signUp', async ({username, email, password }) => {

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/signup",{
        method: 'post',
        body: JSON.stringify({
            'username': `${username}`,
            'email': `${email}`,
            'password': `${password}`
        })
    });

    const fetchedData = await fetchedJson.json();

    return fetchedData;   
});

export const signIn = createAsyncThunk('user/signIn', async ({usernameOrEmail, password}) => {

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/login",{
        method: 'post',
        body: JSON.stringify({
            'usernameOrEmail': `${usernameOrEmail}`,
            'password': `${password}`,
        })
    });

    const fetchedData = await fetchedJson.json();

    return fetchedData;
});


export const getTokenConfirm = createAsyncThunk('user/getTokenConfirm', async ( _ ,{getState}) => {

    const phoneToken = getState().user.phoneToken;
    const otp = getState().user.otp;

    console.log(phoneToken);
    console.log(otp);

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/login",{
        method: 'post',
        body: JSON.stringify({
            'phone-token': `${phoneToken}`,
            'otp': `${otp}`,
        })
    });

    const fetchedData = await fetchedJson.json();

    console.log(fetchedData);

    if (fetchedData.error) {
        // eslint-disable-next-line no-throw-literal
        throw "error";
    }

    return fetchedData;
});

const userSlice = createSlice({
    name: 'user',
    initialState: {
        phoneToken: null,
        otp: "123456",
        token: null,
        name: null,
        userId: null,
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
            state.name = action.payload.name;
            state.phoneToken = action.payload["phone-token"];
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
            state.name = action.payload.name;
            state.token = action.payload.token;
        },
        [signIn.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [getTokenConfirm.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [getTokenConfirm.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.name = action.payload.name;
            state.token = action.payload.userId;
            state.token = action.payload.token;
        },
        [getTokenConfirm.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});


export default userSlice.reducer;

export const { signOut } = userSlice.actions;