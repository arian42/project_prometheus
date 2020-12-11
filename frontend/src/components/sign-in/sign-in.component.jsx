import { useState } from 'react';
import { signIn } from '../../redux/user/userReducer';
import { useDispatch } from 'react-redux';

import './sign-in.styles.scss';

const SignIn = () => {
    const dispatch = useDispatch();

    const [userCredentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: '',
    });

    const { usernameOrEmail, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();
    
        dispatch(signIn({usernameOrEmail, password}));
    };
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };

    return (
        <div className='sign-in'>
            <p className="title">I already have an account</p>
            <form onSubmit={handleSubmit}>
                <input
                    name='usernameOrEmail'
                    type='text'
                    onChange={handleChange}
                    placeholder='Username or Email'
                    value={usernameOrEmail}
                    label='username or email'
                    autoComplete="on"
                    required
                />
                <input
                    name='password'
                    type='password'
                    onChange={handleChange}
                    placeholder='Password'
                    value={password}
                    label='password'
                    autoComplete="on"
                    required
                />
                <button className='button' type='submit'> Sign in</button>
            </form>
        </div>
    );
};

export default SignIn;