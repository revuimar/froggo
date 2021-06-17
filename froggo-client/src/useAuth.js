import { createContext, useContext, useState, useEffect } from 'react';

const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>
    {children}
  </authContext.Provider>
}

export function useAuth() {
    return useContext(authContext);
}

function useProvideAuth() {
    const [user, setUser] = useState(null);
  
    const signin = async (login, password)  => {
      try {
        const res = await fetch('http://localhost:3001/api/login' ,{
          method: 'POST',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              "username": login,
              "password": password
            })
          });
          if(!res.ok) {
            return null;
          }
          const token = await res.json();
          //sessionStorage.setItem('JWT_Token', data);
          const user = {"username" : login, "token": token}
          setUser(user);
          return user;
        }
        catch(error) {
          console.log(error);
          return null;
        }
    };
  
    useEffect(() => {
      const unsubscribe = () => {};
      // firebase.auth().onAuthStateChanged((user) => {
      //   if (user) {
      //     setUser(user);
      //   } else {
      //     setUser(false);
      //   }
      // });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  
    // Return the user object and auth methods
    return {
      user,
      signin
    };
}
