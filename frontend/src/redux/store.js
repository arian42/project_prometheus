import { configureStore } from '@reduxjs/toolkit';

//import { persistStore, persistReducer } from 'redux-persist';
//import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from './user/userReducer';

export default configureStore({
    reducer: {
        user: userReducer
    }
});