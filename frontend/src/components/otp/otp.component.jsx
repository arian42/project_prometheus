import { useState } from 'react';

const Otp = () => {
    const [userCredentials, setCredentials] = useState({
        otp: '',
    });

    const { otp } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();

        if (!otp) {
            return
        }
    
    };
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };


    return (
        <div>
            <p className="title"></p>
            <form onSubmit={handleSubmit}>
                <input
                    name='phone'
                    type='tel'
                    onChange={handleChange}
                    placeholder='SMS code'
                    value={otp}
                    label='SMS code'
                    required
                />
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}

export default Otp;