import { 
    createSlice,
    createAsyncThunk,
} from '@reduxjs/toolkit';


const signInSignUpProfile = async ({username, token}) => {

    const profileFetchedJson = await fetch("http://127.0.0.1:5000/api/profile",{
        method: 'POST',
        body: JSON.stringify({
            'username': `${username}`,
            'token': `${token}`,
        })
    });

    const profileFetchedData = await profileFetchedJson.json();

    return {...profileFetchedData, token};
}

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

    return signInSignUpProfile(fetchedData);
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

    return signInSignUpProfile(fetchedData);
});

export const profile = createAsyncThunk('user/profile', async (_, { getState } ) => {
    const {username,token} = getState().user;

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/profile",{
        method: 'POST',
        body: JSON.stringify({
            'username': `${username}`,
            'token': `${token}`,
        })
    });

    const fetchedData = await fetchedJson.json();

    return fetchedData;
});

export const conversationProfile = createAsyncThunk('user/profile', async (_, { getState } ) => {
    const {userSearch, token} = getState().user;
    const username = userSearch.username;

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/profile",{
        method: 'POST',
        body: JSON.stringify({
            'username': `${username}`,
            'token': `${token}`,
        })
    });
    console.log(fetchedJson);

    const fetchedData = await fetchedJson.json();

    return fetchedData;
});

export const profileSearch = createAsyncThunk('user/profileSearch', async ({search}, { getState } ) => {
    const {token} = getState().user;

    const fetchedJson = await fetch("http://127.0.0.1:5000/api/search",{
        method: 'POST',
        body: JSON.stringify({
            'username': `${search}`,
            'token': `${token}`,
        })
    });

    const fetchedData = await fetchedJson.json();
    console.log(fetchedData);

    return fetchedData;
});





const userSlice = createSlice({
    name: 'user',
    initialState: {
        token: null,
        profile: {
            name: null,
            username: null,
            avatar: null,
        },
        userSearch: {
            name: null,
            avatar: null,
            username: null,
        },
        status: 'idle',
        error: null,
    },
    reducers: {
        signOut(state, _action) {
            state.token = null;
            state.profile = {
                name: null,
                username: null,
                avatar: null,
            };
            state.status = 'idle';
        },
        nullUserSearch(state, _action) {
            state.userSearch = {
                name: null,
                avatar: null,
                username: null,
            }
        }
    },
    extraReducers: {
        [signUp.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [signUp.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.profile.name = action.payload.name;
            state.profile.username = action.payload.username;
            state.profile.avatar = action.payload.avatar;
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
            state.profile.name = action.payload.name;
            state.profile.username = action.payload.username;
            state.profile.avatar = action.payload.avatar;
            state.token = action.payload.token;
        },
        [signIn.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [profile.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [profile.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.profile = action.payload;
        },
        [profile.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [profileSearch.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [profileSearch.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.userSearch = action.payload;
        },
        [profileSearch.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
        [conversationProfile.pending]: (state, _action) => {
            state.status = 'loading'
        },
        [conversationProfile.fulfilled]: (state, action) => {
            state.status = 'succeeded';
            state.userSearch = action.payload;
        },
        [conversationProfile.rejected]: (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        },
    }
});


export default userSlice.reducer;

export const { signOut, nullUserSearch } = userSlice.actions;