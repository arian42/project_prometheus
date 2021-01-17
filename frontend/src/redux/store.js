import { combineReducers, configureStore } from '@reduxjs/toolkit';
import thunk from "redux-thunk";
import logger from "redux-logger";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // defaults to localStorage for web

import userReducer from './user/userReducer';
import chatReducer from './chat/chatReducer';
import uiReducer from './ui/uiReducer';

const persistConfig = {
    key: 'root',
    storage,
    blacklist: [], //Things u dont persist
};

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    ui: uiReducer,
});

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk, logger]
});

export const persistor = persistStore(store)
