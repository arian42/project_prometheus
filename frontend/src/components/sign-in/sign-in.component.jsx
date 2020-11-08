import { useState } from 'react';

const SignIn = () => {
    const [userCredentials, setCredentials] = useState({
        phone: '',
    });

    const { phone } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();
    
        try{
            let phoneTokenJson = await fetch("http://127.0.0.1:5000/api/login",{
                method: 'post',
                body: JSON.stringify({
                    "phone-token": "yyyyyyyyyyyyyyy",
                })
            });
    
            let phoneToken = await phoneTokenJson.json();

            console.log(phoneToken);
            console.log(phoneToken["phone-token"]);
    
            let tokenAndNameJson = await fetch("http://127.0.0.1:5000/api/login",{
                method: 'post',
                body: JSON.stringify({
                    "phone-token": `${phoneToken["phone-token"]}`,
                    "otp": "123456"
                })
            })
    
            let tokenAndName = await tokenAndNameJson.json();

        }catch(error){
            console.log(error);
        }
    };
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };


    return (
        <div>
            <p className="title">I already have an account</p>
            <span>Sign in with your phone number</span>
            <form onSubmit={handleSubmit}>
                <input
                    name='phone'
                    type='tel'
                    onChange={handleChange}
                    placeholder='Phone Number'
                    value={phone}
                    label='phone'
                    required
                />
                <button type='submit'> Sign in</button>
            </form>
        </div>
    )
}

export default SignIn;