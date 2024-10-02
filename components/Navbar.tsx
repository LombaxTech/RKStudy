import { AuthContext } from "@/context/AuthContext";
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";

const provider = new GoogleAuthProvider();

const links = [
  {
    label: "Quizzes",
    href: "/",
  },
  {
    label: "AI Tutor",
    href: "/ai-tutor",
  },
  {
    label: "Feedback",
    href: "/feedback",
  },
];

export default function Navbar() {
  const { user, userLoading } = useContext(AuthContext);
  const router = useRouter();

  const signout = async () => {
    try {
      await signOut(auth);
      console.log("signed out");
      router.push("/");
    } catch (error) {
      console.log("error signing out...");
      console.log(error);
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

  // const userSetupComplete = !(user?.setup === false) && (user?.schoolId || user?.isLoneStudent);

  const userSetupComplete = !(user?.setup === false);

  const isSuperadmin = user?.type === "superadmin";
  const isStudent = user?.type === "student";

  return (
    <div className="p-4 flex items-center justify-between shadow-md">
      <h1 className="font-bold italic">
        <Link href={"/"}>RKStudy</Link>

        {/* {user && <h1 className="">Type: {user.type}</h1>} */}
      </h1>
      <ul className="flex items-center gap-4">
        {/* {!user && <GoogleButton onClick={signinWithGoogle} />} */}

        {user && isSuperadmin && (
          <>
            <Link href={"/superadmin/users"}>All Users</Link>
          </>
        )}

        {!user && (
          <Link href={"signin"}>
            <button className="btn btn-primary btn-sm">Login</button>
          </Link>
        )}

        {user && !userSetupComplete && (
          <li className="cursor-pointer" onClick={signout}>
            Sign Out
          </li>
        )}

        {user && userSetupComplete && (
          <>
            {isStudent && (
              <>
                {links.map((link, i: number) => {
                  return (
                    <Link href={link.href} className="font-medium">
                      {link.label}
                    </Link>
                  );
                })}
                {/* <Link href={`/`} className="font-medium">
                  Quizzes
                </Link> */}
                {/* <Link href={`/notes`} className="font-medium">
                  Notes
                </Link> */}
                {/* <Link href={`/ai-tutor`} className="font-medium">
                  AI Tutor
                </Link> */}
                {/* <Link href={`/roadmap`} className="font-medium">
                  Future Features
                </Link> */}
              </>
            )}
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="w-10 h-10 rounded-full flex justify-center items-center bg-primary text-white"
              >
                <span className="">{user.name[0]}</span>
              </div>

              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link href={`/my-profile`}>Settings</Link>
                </li>
                <li onClick={signout}>
                  <span>Sign Out</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </ul>
    </div>
  );
}
