import GoogleButton from "@/components/GoogleButton";
import { auth } from "@/firebase";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const provider = new GoogleAuthProvider();

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      let authUser = await signInWithEmailAndPassword(auth, email, password);
      console.log("res of signin in ");
      console.log(authUser);

      setSuccess(true);
    } catch (error) {
      console.log(error);
      setError("error");
    }
  };

  const signinWithGoogle = async () => {
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;
          console.log(result);
          router.push("/");
        })
        .catch((error) => {
          console.log(error);
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    } catch (error) {
      console.log(error);
    }
  };

  const login = async () => {
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
    } catch (error) {
      console.log(error);
      setError(`Incorrect details.`);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center gap-4 pt-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <Link href={"/signup"} className="underline">
          Need to create a new account?
        </Link>
      </div>

      <div className="p-10 w-full lg:w-4/12 rounded-md bg-white shadow-md flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="">Email </label>
          <input
            type="email"
            className="p-2 outline-none border"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="">Password </label>
          <input
            type="password"
            className="p-2 outline-none border"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button className="btn btn-primary" onClick={login}>
          Sign In
        </button>
        {/* <GoogleButton
          onClick={signinWithGoogle}
          buttonText="Sign in with Google"
        /> */}
        {error && (
          <div className="p-2 bg-red-200 text-red-700 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
