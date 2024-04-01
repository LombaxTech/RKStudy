import { AuthContext } from "@/context/AuthContext";
import { db } from "@/firebase";
import { Dialog, Transition } from "@headlessui/react";
import {
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  collection,
  getDoc,
  setDoc,
} from "firebase/firestore";
import React, { Fragment, useContext, useState } from "react";
import { FaCalendar, FaRegThumbsUp, FaStar, FaThumbsUp } from "react-icons/fa";

type Feature = {
  id?: string;
  title: string;
  description: string;
};

const futureFeatures = [
  {
    id: "91194e73-62dd-4365-be42-7c2b9da07a4fsji",
    title: "Study Buddies",
    description: "Find other students to study together with",
  },
  {
    id: "91194e73-62dd-4365-be42-7c2b9da07a4f",
    title: "Upvote Quiz",
    description: "Upvote other quizzes and sort quizzes by popularity",
  },
  {
    id: "532cc137-26a8-45b3-bea9-13fd57962c41",
    title: "Save Quizzes",
    description: "Save quizzes to private folders to view quickly and whenever",
  },
  {
    id: "24eb505e-68cf-45eb-9291-3be67dc7b2aa",
    title: "Leaderboard Rankings",
    description:
      "Study more effectively in a competitive manner with fellow students",
  },
];

export default function Roadmap() {
  const { user } = useContext(AuthContext);

  const [requestFeatureModalOpen, setRequestFeatureModalOpen] = useState(false);
  const [featureRequestSent, setFeatureRequestSent] = useState(false);

  const upvoteFeature = async (feature: Feature) => {
    try {
      // todo: update votes on features

      let featureDocRef = doc(db, "upvoted-features", feature.id as string);

      let featureDoc = await getDoc(featureDocRef);

      if (featureDoc.exists()) {
        await updateDoc(featureDocRef, {
          upvotes: arrayUnion(user.uid),
        });
      } else {
        await setDoc(featureDocRef, {
          ...feature,
          upvotes: [user.uid],
        });
      }

      // todo: update users
      await updateDoc(doc(db, "users", user.uid), {
        upvotedFeatures: arrayUnion(feature.id),
      });

      console.log("updated!");
    } catch (error) {
      console.log(error);
    }
  };

  const downvoteFeature = async (feature: Feature) => {
    try {
      await updateDoc(doc(db, "users", user.uid), {
        upvotedFeatures: arrayRemove(feature.id),
      });

      let featureDocRef = doc(db, "upvoted-features", feature.id as string);

      let featureDoc = await getDoc(featureDocRef);

      await updateDoc(featureDocRef, {
        upvotes: arrayRemove(user.uid),
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    const usersUpvotedFeatures = user.upvotedFeatures || [];

    return (
      <>
        <div className="p-10 flex flex-col gap-8">
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">Future Features</h1>
                <FaCalendar size={35} />
              </div>
              <h1 className="text-lg font-normal ">
                These are features we are working on. <br /> Remember to upvote
                features you would like to see sooner!
              </h1>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => setRequestFeatureModalOpen(true)}
            >
              Suggest a Feature
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {futureFeatures.map((feature: Feature) => {
              return (
                <div
                  className="flex items-center p-4 border shadow-md justify-between"
                  key={feature.id}
                >
                  <div className="flex items-center gap-4">
                    <FaStar size={20} />
                    <div className="flex flex-col">
                      <h1 className="text-xl font-medium">{feature.title}</h1>
                      <h1 className="text-sm font-normal">
                        {feature.description}
                      </h1>
                    </div>
                  </div>

                  <div className="flex flex-col items-center mr-4">
                    {usersUpvotedFeatures.includes(feature.id) ? (
                      <>
                        <div
                          className="cursor-pointer"
                          onClick={() => downvoteFeature(feature)}
                        >
                          <FaThumbsUp size={20} />
                        </div>
                        <h1 className="text-lg">Feature Upvoted!</h1>
                      </>
                    ) : (
                      <>
                        <div
                          className="cursor-pointer"
                          onClick={() => upvoteFeature(feature)}
                        >
                          <FaRegThumbsUp size={20} />
                        </div>
                        <h1 className="text-lg">Upvote Feature</h1>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {featureRequestSent && (
          <div className="fixed bottom-0 pb-4 w-full">
            <div className="alert alert-success w-1/2 mx-auto flex justify-center rounded-full">
              <h1 className="text-white">Feature Request Submitted!</h1>
            </div>
          </div>
        )}
        <RequestFeatureModal
          requestFeatureModalOpen={requestFeatureModalOpen}
          setRequestFeatureModalOpen={setRequestFeatureModalOpen}
          featureRequestSent={featureRequestSent}
          setFeatureRequestSent={setFeatureRequestSent}
        />
      </>
    );
  }
}

function RequestFeatureModal({
  requestFeatureModalOpen,
  setRequestFeatureModalOpen,
  featureRequestSent,
  setFeatureRequestSent,
}: {
  requestFeatureModalOpen: any;
  setRequestFeatureModalOpen: any;
  featureRequestSent: any;
  setFeatureRequestSent: any;
}) {
  const closeModal = () => setRequestFeatureModalOpen(false);
  const openModal = () => setRequestFeatureModalOpen(true);

  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");

  const requestFeature = async () => {
    setError("");

    try {
      const newFeatureRequest = {
        title,
        description,
        createdAt: new Date(),
        createdBy: {
          id: user.uid,
          name: user.name,
        },
      };

      await addDoc(collection(db, "feature-requests"), newFeatureRequest);

      setFeatureRequestSent(true);
      setTimeout(() => setFeatureRequestSent(false), 7 * 1000);

      console.log("Made new feature request!");
      closeModal();
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    }
  };

  return (
    <>
      <Transition appear show={requestFeatureModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Request A Feature
                  </Dialog.Title>

                  <div className="flex flex-col gap-4 mt-4">
                    <div className="flex flex-col gap-2">
                      <label className="">Title</label>
                      <input
                        type="text"
                        className="p-2 outline-none border"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter feature name"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="">Description</label>
                      <textarea
                        className="p-2 outline-none border"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your feature"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={requestFeature}
                      disabled={!title || !description}
                    >
                      Submit Request
                    </button>

                    {/* <button
                      type="button"
                      className="btn btn-primary"
                      onClick={closeModal}
                    >
                      No
                    </button> */}
                  </div>
                  {error && (
                    <div className="bg-red-200 text-red-700 p-4	 mt-4">
                      {error}
                    </div>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
