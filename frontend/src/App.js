import {
  Switch,
  Route,
  Redirect,
  //Link,
} from "react-router-dom";

import { useSelector } from 'react-redux'

import Messenger from './pages/messenger/messenger.component';
import SignInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
//import Spinner from './components/spinner/spinner.component';

import './App.css';


function App() {

  const currentUser = useSelector(state => state.user.profile);
  const currentToken = useSelector(state => state.user.token);

  
  return (
    <div className="App">
      <Switch>
        <Route exact path='/messenger' component={Messenger} />
        <Route
          exact
          path='/'
          render={() =>
            currentUser && currentToken ? <Redirect to='/messenger' /> : <SignInAndSignUp />
          }
        />
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
