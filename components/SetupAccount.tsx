import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useContext, useRef, useState } from "react";

export default function SetupAccount() {
  const { user, setUser } = useContext(AuthContext);

  const [name, setName] = useState(user?.displayName || "");
  const [file, setFile] = useState<any>(null);
  const fileInputRef = useRef<any>(null);

  const finishProfileSetup = async () => {
    let imageUrl;

    // todo: Upload image if image
    // if (file) {
    //   const fileRef = `profilePictures/${user.uid}/${file.name}`;

    //   const storageRef = ref(storage, fileRef);
    //   await uploadBytes(storageRef, file).then((snapshot) => {
    //     console.log("Uploaded a blob or file!");
    //   });

    //   imageUrl = await getDownloadURL(ref(storage, fileRef));
    // }

    const firestoreUser = {
      name,
      email: user.email,
      createdAt: new Date(),
      type: "student",
      isLoneStudent: true,
      specs: [],
      // profilePictureUrl: imageUrl,
    };

    // setFile(null);

    await setDoc(doc(db, "users", user.uid), firestoreUser);
    setUser({ ...user, ...firestoreUser, setup: true });
  };

  return (
    <div className="p-4 flex flex-col gap-4 items-center">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-xl">Set up your profile</h1>
        <input
          type="text"
          className="border outline-none p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="name"
        />

        {/* <div className="flex flex-col my-4">
        <label>Upload profile picture</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e: any) => setFile(e.target.files[0])}
          // style={{ display: "none" }}
        />
        {file && (
          <div className="relative">
            <img src={URL.createObjectURL(file)} width="100" />
            <div className="cursor-pointer" onClick={() => setFile(null)}>
              Delete
            </div>
          </div>
        )}
      </div> */}

        <button
          disabled={!name || name.length < 2}
          className="btn btn-primary"
          onClick={finishProfileSetup}
        >
          Finish Profile Set Up
        </button>
      </div>
    </div>
  );
}
