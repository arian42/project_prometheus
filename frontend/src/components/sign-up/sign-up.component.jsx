import { useState } from 'react';

const SignIn = () => {
    const [userCredentials, setCredentials] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();
    
        
    };
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };


    return (
        <div>
            <p className="title">Don't have an account, why not make one ? </p>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleSubmit}>
                <input
                        name='name'
                        type='name'
                        onChange={handleChange}
                        value={name}
                        label='name'
                        required
                />
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
                <button type='submit'> Sign up </button>
            </form>
        </div>
    )
}

export default SignIn;