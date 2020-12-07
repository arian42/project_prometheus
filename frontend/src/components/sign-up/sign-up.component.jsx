import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { signUp } from '../../redux/user/userReducer';

import './sign-up.styles.scss';

const SignIn = () => {
    const dispatch = useDispatch();

    const [userCredentials, setCredentials] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
    });

    const { name, username, email, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();

        dispatch(signUp({name, username, email, password }));
    }
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };

    return (
        <div className='sign-up'>
            <p className="title">Don't have an account, why not make one? </p>
            <form onSubmit={handleSubmit}>
                <input
                    name='name'
                    type='name'
                    onChange={handleChange}
                    placeholder='Name'
                    value={name}
                    label='name'
                    required
                />
                <input
                    name='username'
                    type='username'
                    onChange={handleChange}
                    placeholder='Username'
                    value={username}
                    label='username'
                    required
                />
                <input
                    name='email'
                    type='email'
                    onChange={handleChange}
                    placeholder='Email'
                    value={email}
                    label='email'
                    required
                />
                <input
                    name='password'
                    type='password'
                    onChange={handleChange}
                    placeholder='Password'
                    value={password}
                    label='password'
                    required
                />
                {/* <input
                    name='password'
                    type='password'
                    onChange={confirmPassword}
                    placeholder='Password'
                    value={password}
                    label='password'
                    required
                /> */}
                <button type='submit'> Sign up </button>
                <span>warning: verify your account within 48 hours otherwise your account will be deleted.</span>
            </form>
        </div>
    );
};

export default SignIn;