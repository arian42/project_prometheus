
import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';
import Header from '../../components/header/header.component';

import './sign-in-and-sign-up.styles.scss';

function SignInAndSignUp() {
<<<<<<< HEAD
    return (
      <div className="wrapper">
        <div className="header">
          <Header/>
        </div>
        <div className="sign-in-and-sign-up">
          <SignIn/>
          <SignUp/>
        </div>
=======
  return (
    <div className="wrapper">
      <div className="header">
        <Header/>
>>>>>>> fcd85e9fbdb7ea15fddaa0b3fc9f092a92ac7f71
      </div>
      <div className="sign-in-and-sign-up">
        <SignIn/>
        <SignUp/>
      </div>
    </div>
  );
}
  
export default SignInAndSignUp;