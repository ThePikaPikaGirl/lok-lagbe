import React, { useState, useRef, useEffect } from "react";
import {
  solid,
  regular,
  brands,
} from "@fortawesome/fontawesome-svg-core/import.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import WorkerSidebar from "../../components/worker/WorkerSidebar";
import WorkerProfileSide from "../../components/worker/WorkerProfileSide";
import "./../../styles/scroller.css";
import { firebaseFirestore, firebaseDB } from "../../firebase";
import { formatRelative } from "date-fns";

function Comment({ author, timestamp, message, avatar }) {
  const commentRef = useRef();

  useEffect(() => {
    commentRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [commentRef]);

  return (
    <div className="flex w-full mb-4 flex-shrink-0" ref={commentRef}>
      <div className="h-14 w-14 rounded-full overflow-hidden mr-4 border-[1px] border-gray-400">
        <img
          src={
            avatar
              ? avatar
              : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
          }
          alt="profile"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex-1 bg-slate-200 rounded-lg p-4">
        <div className="flex items-center mb-2">
          <p className="text-lg font-bold mr-2">{author}</p>
          <p className="text-sm text-gray-500 font-semibold">
            {formatRelative(new Date(timestamp.seconds * 1000), new Date())
              .charAt(0)
              .toUpperCase() +
              formatRelative(
                new Date(timestamp.seconds * 1000),
                new Date()
              ).substring(1)}
          </p>
        </div>

        <p className="text-md">{message}</p>
      </div>
    </div>
  );
}

function Post({
  content,
  author,
  avatar,
  timestamp,
  visibillity,
  id,
  isAdmin,
  comments,
}) {
  const { currentUser, logout, getRealtimePublicPosts } = useAuth();
  const [isNew, setIsNew] = useState(true);
  const [isViewingComments, setIsViewingComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleDeletion = async () => {
    const docRef = firebaseFirestore.doc(firebaseDB, `posts/${id}`);

    await firebaseFirestore.deleteDoc(docRef);
  };

  const handleComment = async () => {
    const docRef = firebaseFirestore.doc(firebaseDB, `posts/${id}`);

    await firebaseFirestore.updateDoc(docRef, {
      comments: [
        ...comments,
        {
          id: Math.random().toString(),
          author: currentUser.displayName,
          avatar: currentUser.photoURL,
          message: newComment,
          timestamp: firebaseFirestore.Timestamp.fromDate(new Date()),
        },
      ],
    });

    setNewComment("");
  };

  useEffect(() => {
    setTimeout(() => {
      setIsNew(false);
    }, 10000);
  }, []);

  return (
    <div className="bg-slate-200 w-11/12 flex flex-col items-center justify-start rounded-lg border-2 border-gray-200 mb-8 flex-shrink-0 overflow-hidden">
      {isViewingComments && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50">
          <div className="bg-slate-100 h-5/6 w-3/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
            <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
              <div className="flex items-center">
                <p className="text-3xl font-bold text-blue-800 mr-8">
                  Comments
                </p>
              </div>

              <button
                className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
                onClick={() => {
                  setIsViewingComments(false);
                }}
              >
                <FontAwesomeIcon
                  icon={solid("times")}
                  className="text-center text-2xl"
                />
              </button>
            </div>

            <div
              className="w-full h-4/6 flex flex-col items-center px-8 py-6 overflow-scroll"
              id="panel"
            >
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  author={comment.author}
                  timestamp={comment.timestamp}
                  message={comment.message}
                  avatar={comment.avatar}
                />
              ))}
            </div>

            <div className="bg-slate-200 border-t-[1px] border-gray-300 w-full h-1/6 flex items-center justify-center">
              <input
                type="text"
                placeholder="Write a comment..."
                className="rounded-lg w-9/12 h-12 mr-8"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />

              <button
                type="button"
                className="text-white rounded-lg w-20 h-12 flex items-center justify-center transition-all bg-blue-700 hover:bg-blue-800"
                onClick={() => {
                  handleComment();
                }}
              >
                <FontAwesomeIcon
                  icon={solid("paper-plane")}
                  className="text-center text-2xl"
                />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-slate-300 w-full h-[6rem] flex items-center relative">
        {isNew && (
          <>
            <div className="bg-green-500 h-4 w-4 absolute rounded-full top-2 left-2"></div>
            <div className="bg-green-500 h-4 w-4 absolute rounded-full top-2 left-2 animate-ping"></div>
          </>
        )}

        <div className="h-14 w-14 rounded-full overflow-hidden mx-4 border-2 border-gray-600">
          <img
            src={
              avatar
                ? avatar
                : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
            }
            alt="profile"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-lg font-bold">{author}</p>
          <p className="text-md font-medium text-gray-600">
            {formatRelative(new Date(timestamp.seconds * 1000), new Date())
              .charAt(0)
              .toUpperCase() +
              formatRelative(
                new Date(timestamp.seconds * 1000),
                new Date()
              ).substring(1)}
            &nbsp;&nbsp;&bull;&nbsp;&nbsp;
            {visibillity === "public" ? (
              <FontAwesomeIcon
                icon={solid("globe")}
                className="text-gray-800 text-sm"
                title="Public"
              />
            ) : (
              <FontAwesomeIcon
                icon={solid("lock")}
                className="text-gray-800 text-sm"
                title="Private"
              />
            )}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            className="ml-8 h-10 text-red-600 flex items-center font-semibold text-lg hover:text-red-800 transition-all"
            onClick={handleDeletion}
          >
            <FontAwesomeIcon
              icon={solid("trash-alt")}
              className=""
              title="More"
            />
            &nbsp;&nbsp;Delete Post
          </button>
        )}
      </div>

      <div className="min-h-[6rem] w-full flex-col items-center justify-center px-8 py-6">
        {content.split("\n\n").map((itemnn, indexnn) => (
          <p key={indexnn} className="text-md mb-4">
            {itemnn.split("\n").map((itemn, indexn) => (
              <React.Fragment key={indexn}>
                <span>{itemn}</span>
                <br />
              </React.Fragment>
            ))}
          </p>
        ))}
      </div>

      <div className="bg-slate-300 w-full min-h-[6rem] flex flex-col items-center">
        <div className="flex items-center w-full h-[3rem] px-4">
          <p className="text-lg font-semibold text-gray-600">
            {comments.length} Comments
          </p>
        </div>

        <div className="w-full h-[3rem] px-4">
          <button
            type="button"
            className="text-blue-700 font-medium transition-all hover:text-blue-900"
            onClick={() => {
              setIsViewingComments(true);
            }}
          >
            View Comments
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivatePosts() {
  const { currentUser, logout, getRealtimePublicPosts } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = firebaseFirestore.query(
      firebaseFirestore.collection(firebaseDB, "posts"),
      firebaseFirestore.where("email", "==", currentUser.email),
      firebaseFirestore.orderBy("createdAt", "desc"),
      firebaseFirestore.limit(100)
    );

    const unsubscribe = firebaseFirestore.onSnapshot(q, (querySnapshot) => {
      const publicPosts = [];

      querySnapshot.forEach((doc) => {
        publicPosts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPosts(publicPosts);
    });

    return unsubscribe;
  }, [currentUser.email]);

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          content={post.body}
          author={post.author}
          avatar={post.avatar}
          timestamp={post.createdAt}
          visibillity={post.visibillity}
          comments={post.comments}
          isAdmin={true}
        />
      ))}
    </>
  );
}

function PublicPosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const q = firebaseFirestore.query(
      firebaseFirestore.collection(firebaseDB, "posts"),
      firebaseFirestore.where("visibillity", "==", "public"),
      firebaseFirestore.orderBy("createdAt", "desc"),
      firebaseFirestore.limit(100)
    );

    const unsubscribe = firebaseFirestore.onSnapshot(q, (querySnapshot) => {
      const publicPosts = [];

      querySnapshot.forEach((doc) => {
        publicPosts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setPosts(publicPosts);
    });

    return unsubscribe;
  }, []);

  return (
    <>
      {posts.map((post) => (
        <Post
          key={post.id}
          id={post.id}
          content={post.body}
          author={post.author}
          avatar={post.avatar}
          timestamp={post.createdAt}
          visibillity={post.visibillity}
          comments={post.comments}
          isAdmin={false}
        />
      ))}
    </>
  );
}

function WorkerTimeline() {
  const { currentUser, logout, getRealtimePublicPosts } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [currentTab, setCurrentTab] = useState("public");
  const [isPublic, setIsPublic] = useState(true);

  const handleNewPostSumbit = async () => {
    const postsRef = firebaseFirestore.collection(firebaseDB, "posts");

    const post = {
      author: currentUser.displayName,
      email: currentUser.email,
      avatar: currentUser.photoURL,
      body: newPost.trim(),
      createdAt: firebaseFirestore.Timestamp.fromDate(new Date()),
      visibillity: isPublic ? "public" : "private",
      comments: [],
    };

    try {
      setModalOpen(false);
      await firebaseFirestore.addDoc(postsRef, post);
      setNewPost("");
      setIsPublic(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="h-[85%] w-[90%] flex items-center justify-center sm:bg-slate-100 overflow-hidden shadow-xl rounded-3xl">
      <div
        className={
          !modalOpen
            ? "hidden"
            : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0007] h-full w-full flex items-center justify-center z-50"
        }
      >
        <div className="bg-slate-100 h-4/6 w-3/6 opacity-100 rounded-3xl shadow-2xl flex flex-col items items-center overflow-hidden">
          <div className="w-full h-1/6 flex items-center justify-between px-16 bg-slate-200 border-b-[1px] border-gray-300">
            <div className="flex items-center">
              <p className="text-3xl font-bold text-blue-800 mr-8">
                Create new {isPublic ? "public" : "private"} post
              </p>

              <div className="flex items-center justify-center w-[12rem] h-[2.5rem]">
                <input
                  className="hidden"
                  type="radio"
                  name="isPublic"
                  id="yes"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                />
                <input
                  className="hidden"
                  type="radio"
                  name="isPublic"
                  id="no"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                />

                <label
                  className={
                    isPublic
                      ? "text-sm w-1/2 h-full border-2 border-blue-700 flex items-center justify-center rounded-l-xl text-blue-700 font-semibold transition-all cursor-not-allowed"
                      : "text-sm w-1/2 h-full bg-blue-700 border-2 border-blue-700 flex items-center justify-center rounded-l-xl text-white font-semibold transition-all cursor-pointer"
                  }
                  htmlFor="yes"
                >
                  <FontAwesomeIcon icon={solid("globe")} className="text-sm" />
                  &nbsp;&nbsp;Public
                </label>

                <label
                  className={
                    !isPublic
                      ? "text-sm w-1/2 h-full border-2 border-blue-700 flex items-center justify-center rounded-r-xl text-blue-700 font-semibold transition-all cursor-not-allowed"
                      : "text-sm w-1/2 h-full bg-blue-700 border-2 border-blue-700 flex items-center justify-center rounded-r-xl text-white font-semibold transition-all cursor-pointer"
                  }
                  htmlFor="no"
                >
                  <FontAwesomeIcon icon={solid("lock")} className="text-sm" />
                  &nbsp;&nbsp;Private
                </label>
              </div>
            </div>

            <button
              className="border-red-700 border-4 text-red-700 rounded-full w-12 h-12 flex items-center justify-center transition-all hover:bg-red-700 hover:text-white"
              onClick={() => {
                setModalOpen(false);
              }}
            >
              <FontAwesomeIcon
                icon={solid("times")}
                className="text-center text-2xl"
              />
            </button>
          </div>

          <div className="w-full h-5/6 flex flex-col">
            <textarea
              className="w-full h-5/6 text-xl px-6 py-8 bg-slate-300"
              placeholder={`What's on your mind, ${currentUser.displayName}?`}
              id="panel"
              value={newPost}
              onChange={(e) => {
                setNewPost(e.target.value);
              }}
            ></textarea>

            <div className="w-full h-1/6 flex items-center justify-center">
              <button
                className={
                  "bg-blue-700 rounded-xl w-11/12 h-4/6 flex items-center justify-center transition-all" +
                  (newPost.trim().length > 0
                    ? " hover:bg-blue-800"
                    : " cursor-not-allowed grayscale-[0.8]")
                }
                disabled={newPost.trim().length < 1}
                onClick={() => {
                  handleNewPostSumbit();
                }}
              >
                <FontAwesomeIcon
                  icon={solid("paper-plane")}
                  className="text-white text-2xl mr-4"
                />
                <p className="text-white text-2xl">Post</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <WorkerSidebar />

      <div
        className="h-full w-8/12 flex flex-col items-center bg-slate-50 overflow-scroll scroll-smooth"
        id="scrollview"
      >
        <div className="h-[8rem] w-11/12 flex items-center justify-center mb-8 flex-shrink-0">
          <p className="text-center font-bold text-3xl text-blue-800">
            <FontAwesomeIcon icon={solid("timeline")} className="mr-4" />
            Timeline
          </p>
        </div>
        <div className="bg-slate-200 h-[6rem] w-11/12 flex items-center justify-center rounded-lg border-2 border-gray-200 flex-shrink-0 mb-4">
          <div className="h-14 w-14 rounded-full overflow-hidden mr-4">
            <img
              src={
                currentUser.photoURL
                  ? currentUser.photoURL
                  : "https://img.freepik.com/free-vector/illustration-user-avatar-icon_53876-5907.jpg?t=st=1658422712~exp=1658423312~hmac=31ac28379a7d356b43a14e42eb3b3ae8b61eaca34f8baaeea6afaa2e5aff18a5&w=900"
              }
              alt="profile"
              className="h-full w-full object-cover"
            />
          </div>

          <button
            type="button"
            className="bg-slate-400 h-14 w-10/12 rounded-full overflow-hidden flex items-center justify-start px-6 font-semibold text-xl text-white border-2 border-slate-400 transition-all hover:bg-slate-500"
            onClick={() => setModalOpen(true)}
          >
            {newPost.trim().length < 1
              ? `What's on your mind, ${currentUser.displayName}?`
              : newPost.substring(0, 100).trim()}
          </button>
        </div>
        <div className="mb-8 h-[4rem] w-11/12 flex items-center justify-center flex-shrink-0">
          <div className="mx-8 h-full w-[18rem] rounded-lg font-semibold text-lg overflow-hidden">
            <input
              type="radio"
              name="currentTab"
              id="public"
              className="hidden"
              checked={currentTab === "public"}
              onChange={() => {
                setCurrentTab("public");
              }}
            />
            <label
              htmlFor="public"
              className={
                currentTab === "public"
                  ? "w-full h-full flex items-center justify-center text-center border-blue-500 border-4 text-blue-500 rounded-lg transition-all cursor-not-allowed"
                  : "w-full h-full flex items-center justify-center text-center bg-blue-500 text-white rounded-lg transition-all cursor-pointer"
              }
            >
              {currentTab === "public"
                ? "Currently Seeing Public Posts"
                : "See Public Posts"}
            </label>
          </div>

          <div className="mx-8 h-full w-[18rem] rounded-lg font-semibold text-lg overflow-hidden">
            <input
              type="radio"
              name="currentTab"
              id="personal"
              className="hidden"
              checked={currentTab === "personal"}
              onChange={() => {
                setCurrentTab("personal");
              }}
            />
            <label
              htmlFor="personal"
              className={
                currentTab === "personal"
                  ? "w-full h-full flex items-center justify-center text-center border-blue-500 border-4 text-blue-500 rounded-lg transition-all cursor-not-allowed"
                  : "w-full h-full flex items-center justify-center text-center bg-blue-500 text-white rounded-lg transition-all cursor-pointer"
              }
            >
              {currentTab === "personal"
                ? "Currently Seeing Your Posts"
                : "See Your Posts"}
            </label>
          </div>
        </div>

        {currentTab === "public" ? <PublicPosts /> : <PrivatePosts />}
      </div>

      <WorkerProfileSide />
    </div>
  );
}

export default WorkerTimeline;
