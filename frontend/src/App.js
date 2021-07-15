import React, { useState } from 'react';
import { Register } from './components/Register';
import { ChatRoom } from './components/ChatRoom';
import PeerProvider from './PeerContext';

function App() {
  const [user, setUser] = useState(null);


  return (
    <PeerProvider>
      <div className="App">
        {
          !user ? <Register setUser={setUser} /> : <ChatRoom />
        }
      </div>
    </PeerProvider>
  );
}

export default App;
