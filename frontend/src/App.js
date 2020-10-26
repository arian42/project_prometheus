import './App.css';
import Messenger from './components/messenger/messenger.component';
import Spinner from './components/spinner/spinner.component';

function App() {
  return (
    <div className="App">
      <Spinner/>
      <Messenger/>
    </div>
  );
}

export default App;
