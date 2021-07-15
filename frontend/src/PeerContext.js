import React, { createContext, useContext } from 'react'
import { PeerManager } from './models/PeerServices';

const PeerContext = createContext();
const AppPeer = new PeerManager();

export const usePeerContext = () => {
  return useContext(PeerContext);
}

function PeerProvider({children}) {
  return (
    <PeerContext.Provider value={AppPeer}>
      {children}
    </PeerContext.Provider>
  )
}

export default PeerProvider
