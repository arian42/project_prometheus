import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { signUp, getTokenConfirm } from '../../redux/user/userReducer';

const SignIn = () => {

    const dispatch = useDispatch();

    const [userCredentials, setCredentials] = useState({
        name: '',
        phone: '',
    });

    const { name, phone, } = userCredentials;

    const handleSubmit = async event => {
        event.preventDefault();

        await dispatch(signUp({name, phone}));
        await dispatch(getTokenConfirm());
    }
    
    const handleChange = event => {
        const { value, name } = event.target;
        
        setCredentials({ ...userCredentials, [name]: value });
    };

    return (
        <div>
            <p className="title">Don't have an account, why not make one ? </p>
            <span>Sign up with your name and phone number</span>
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
                    name='phone'
                    type='tel'
                    onChange={handleChange}
                    placeholder='Phone Number'
                    value={phone}
                    label='phone'
                    required
                />
                <button type='submit'> Sign up </button>
            </form>
        </div>
    );
};

export default SignIn;