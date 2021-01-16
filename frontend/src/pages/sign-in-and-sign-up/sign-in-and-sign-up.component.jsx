
import SignIn from '../../components/sign-in/sign-in.component';
import SignUp from '../../components/sign-up/sign-up.component';
import Header from '../../components/header/header.component';

import './sign-in-and-sign-up.styles.scss';

function SignInAndSignUp() {
  return (
    <div className="wrapper">
      <div className="header">
        <Header/>
      </div>
      <div className="invisible-layer"></div>
      <div className="sign-in-and-sign-up">
        <SignIn/>
        <SignUp/>
      </div>
    </div>
  );
}
  
export default SignInAndSignUp;