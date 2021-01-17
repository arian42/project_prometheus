import { createSlice } from '@reduxjs/toolkit';
import { toggleBoolean } from '../../utilities/utilities.js';

const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        settings: false,
        info: false,
        usernameSearch: false,
        status: 'idle',
        error: null,
    },
    reducers: {
        toggle(state, action) {
            if (action.payload === 'settings') {
                toggleBoolean(state.settings);
            } else if (action.payload === 'info') {
                toggleBoolean(state.info);
            } else if (action.payload === 'usernameSearch') {
                toggleBoolean(state.usernameSearch);
            }
        },
        on(state, action) {
            if (action.payload === 'settings') {
                state.settings = true;
            } else if (action.payload === 'info') {
                state.info = true;
            } else if (action.payload === 'usernameSearch') {
                state.usernameSearch = true;
            }
        },
        off(state, action) {
            if (action.payload === 'settings') {
                state.settings = false;
            } else if (action.payload === 'info') {
                state.info = false;
            } else if (action.payload === 'usernameSearch') {
                state.usernameSearch = false;
            }
        }
    },
});

export default uiSlice.reducer;

export const { on, off, toggle } = uiSlice.actions;