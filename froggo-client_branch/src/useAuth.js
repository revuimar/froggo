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
      const res = await fetch('https://localhost:3001/api/login' ,{
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
  
    const signup = (email, password) => {
      // return firebase
      //   .auth()
      //   .createUserWithEmailAndPassword(email, password)
      //   .then((response) => {
      //     setUser(response.user);
      //     return response.user;
      //   });
    };
  
    const signout = () => {
      // return firebase
      //   .auth()
      //   .signOut()
      //   .then(() => {
      //     setUser(false);
      //   });
    };
    
  

  
    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
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
      signin,
      signup,
      signout
    };
}