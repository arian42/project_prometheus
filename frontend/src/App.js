import {
  Switch,
  Route,
  Redirect,
  //Link,
} from "react-router-dom";

import Messenger from './pages/messenger/messenger.component';
import SignInAndSignUp from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
//import Spinner from './components/spinner/spinner.component';

import './App.css';

let currentUser = "";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path='/messenger' component={Messenger} />
        <Route
              exact
              path='/'
              render={() =>
                currentUser ? <Redirect to='/messenger' /> : <SignInAndSignUp />
              }
            />
      </Switch>
    </div>
  );
}

export default App;
