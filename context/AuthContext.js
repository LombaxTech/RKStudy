import { app, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { useState, useEffect, createContext } from "react";

const auth = getAuth(app);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      setUserLoading(true);

      if (!authUser) {
        setUserLoading(false);
        setUser(null);
      }

      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);

        onSnapshot(userRef, (snapshot) => {
          // USER EXISTS IN FIRESTORE
          if (snapshot.exists()) {
            setUser({ ...authUser, ...snapshot.data() });
            setUserLoading(false);
          }

          // USER DOES NOT EXIST IN FIRESTORE
          if (!snapshot.exists()) {
            setUser({ ...authUser, setup: false });
            setUserLoading(false);
          }
        });
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
