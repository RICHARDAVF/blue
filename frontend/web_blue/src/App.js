

import './App.css';
import 'reactstrap'
import Provider from './components/GlobalContext';
import Controller from './components/Controller';
function App() {
  
  return (
    <Provider>
      <Controller/>
    </Provider>
  );
}

export default App;
