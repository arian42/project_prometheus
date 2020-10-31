import { useState } from 'react';

const SignIn = () => {
    const [userCredentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const { email, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();
    
        
    };
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };


    return (
        <div>
            <p className="title">I already have an account</p>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleSubmit}>
                <input
                    name='email'
                    type='email'
                    onChange={handleChange}
                    value={email}
                    label='email'
                    required
                />
                <input
                    name='password'
                    type='password'
                    value={password}
                    onChange={handleChange}
                    label='password'
                    required
                />
                <button type='submit'> Sign in </button>
            </form>
        </div>
    )
}

export default SignIn;