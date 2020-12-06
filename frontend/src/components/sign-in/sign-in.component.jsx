import { useState } from 'react';

import './sign-in.styles.scss';

const SignIn = () => {
    const [userCredentials, setCredentials] = useState({
        usernameOrEmail: '',
        password: '',
    });

    const { usernameOrEmail, password } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();
    
        try{
            let userTokenJson = await fetch("http://127.0.0.1:5000/api/login",{
                method: 'post',
                body: JSON.stringify({
                    "usernameOrEmail": `${usernameOrEmail}`,
                    "password": `${password}`,
                })
            });
    
            let phoneToken = await userTokenJson.json();

            console.log(phoneToken);
            console.log(phoneToken["phone-token"]);
    
            let tokenAndNameJson = await fetch("http://127.0.0.1:5000/api/login",{
                method: 'post',
                body: JSON.stringify({
                    "phone-token": `${phoneToken["phone-token"]}`,
                    "otp": "123456"
                })
            })
    
            //let tokenAndName = await tokenAndNameJson.json();

        }catch(error){
            console.log(error);
        }
    };
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };


    return (
        <div className='sign-in'>
            <p className="title">I already have an account</p>
            <span>Sign in with your phone number</span>
            <form onSubmit={handleSubmit}>
                <input
                    name='usernameOrEmail'
                    type='text'
                    onChange={handleChange}
                    placeholder='Username or Email'
                    value={usernameOrEmail}
                    label='username or email'
                    required
                />
                <input
                    name='password'
                    type='text'
                    onChange={handleChange}
                    placeholder='Password'
                    value={password}
                    label='password'
                    required
                />
                <button className='button' type='submit'> Sign in</button>
            </form>
        </div>
    );
};

export default SignIn;