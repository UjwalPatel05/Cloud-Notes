import './App.css';
import Home from './components/Home';

import { NoteState } from './context/note/NoteState';
import { UserState } from './context/user/UserState';


function App() {
  return (
    <>
    <NoteState>
      <UserState>
        <Home/>
      </UserState>
    </NoteState>
    </>
  );
}

export default App;
