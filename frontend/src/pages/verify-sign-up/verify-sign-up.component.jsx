import {useState} from 'react';



const VerifySignUp = () => {
    const [code, setCode] = useState('');

    const handleSubmit = async event => {
        event.preventDefault();
    
        try{
            // let userTokenJson = await fetch("http://127.0.0.1:5000/api/login",{
            //     method: 'post',
            //     body: JSON.stringify({
            //         "usernameOrEmail": `${usernameOrEmail}`,
            //         "password": `${password}`,
            //     })
            // });
    
        }catch(error){
            console.log(error);
        }
    };

    const handleChange = event => {
        const { value } = event.target;
        
        setCode(value);
    };

    return (
        <div>
            <span>Please enter the code sent to your Email</span>
            <form onSubmit={handleSubmit}>
                <input
                    name='code'
                    type='code'
                    onChange={handleChange}
                    placeholder='Code'
                    value={code}
                    label='Code'
                    required
                />
                <button className='button' type='submit'>Verify</button>
            </form>
        </div>
    );
}

export default VerifySignUp;

