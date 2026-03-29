import { createContext, useContext, useState } from 'react';

const ExampleContext = createContext();

export function ExampleProvider({ children }) {
  const [state, setState] = useState(null);
  return (
    <ExampleContext.Provider value={{ state, setState }}>
      {children}
    </ExampleContext.Provider>
  );
}

export function useExampleContext() {
  return useContext(ExampleContext);
}
