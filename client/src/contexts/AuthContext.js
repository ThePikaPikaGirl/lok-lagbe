import React, { useContext, useState, useEffect } from "react";
import { firebaseAuth, firebaseFirestore, firebaseDB } from "./../firebase";
// eslint-disable-next-line no-unused-vars
import firebaseApp from "../firebase";
import axios from "axios";
import LoadingScreen from "./../components/LoadingScreen";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(true);

  // Auth Methods
  async function signupWithMail(email, password) {
    return await firebaseAuth.createUserWithEmailAndPassword(
      firebaseAuth.getAuth(),
      email,
      password
    );
  }

  async function loginWithMail(email, password) {
    const credential = await firebaseAuth.signInWithEmailAndPassword(
      firebaseAuth.getAuth(),
      email,
      password
    );

    console.log(credential.user.email);

    return;
  }

  async function logout() {
    await firebaseAuth.signOut(firebaseAuth.getAuth());

    const token = localStorage.getItem("x-access-token");
    if (token !== null) {
      localStorage.removeItem("x-access-token");
    }

    return;
  }

  async function resetPassword(email) {
    return await firebaseAuth.sendPasswordResetEmail(
      firebaseAuth.getAuth(),
      email
    );
  }

  // External Auth Methods
  async function loginWithGoogle() {
    const credential = await firebaseAuth.signInWithPopup(
      firebaseAuth.getAuth(),
      new firebaseAuth.GoogleAuthProvider()
    );

    console.log(credential.user.email);

    return;

    // There is a bug in case of redirecting to the same page
    // So skipped the redirect sign in method and used popup instead

    // return firebaseAuth.signInWithRedirect(
    //   firebaseAuth.getAuth(),
    //   new firebaseAuth.GoogleAuthProvider()
    // );
  }

  async function loginWithFacebook() {
    const credential = await firebaseAuth.signInWithPopup(
      firebaseAuth.getAuth(),
      new firebaseAuth.FacebookAuthProvider()
    );

    console.log(credential.user.email);

    return;

    // There is a bug in case of redirecting to the same page
    // So skipped the redirect sign in method and used popup instead

    // return firebaseAuth.signInWithRedirect(
    //   firebaseAuth.getAuth(),
    //   new firebaseAuth.FacebookAuthProvider()
    // );
  }

  // Session Methods
  async function createUserSession() {
    const user = firebaseAuth.getAuth().currentUser;

    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/api/auth/create_token",
        {
          user,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      localStorage.setItem("x-access-token", res.data.response.token);
    } catch (error) {
      console.log(error);
    }
  }

  async function checkSessionValidity() {
    let isValid = false;

    const token = localStorage.getItem("x-access-token");

    if (token) {
      try {
        const res = await axios.post(
          process.env.REACT_APP_API_BASE_URL + "/api/auth/check_token",
          {
            token,
          }
        );

        isValid = res.data.response.isValid;
      } catch (error) {
        console.log(error);
      }
    }

    return isValid;
  }

  // Verification Methods
  async function verifyPhoneWithCode(phoneNumber) {
    const phoneAuthProvider = new firebaseAuth.PhoneAuthProvider(
      firebaseAuth.getAuth()
    );

    const applicationVerifier = new firebaseAuth.RecaptchaVerifier(
      "recaptcha",
      {
        size: "invisible",
        callback: (response) => {
          console.log(response);
        },
      },
      firebaseAuth.getAuth()
    );

    const verificationId = await phoneAuthProvider.verifyPhoneNumber(
      phoneNumber,
      applicationVerifier
    );

    const verificationCode = window.prompt(
      "Please check your phone and enter the verification code:"
    );

    const credential = firebaseAuth.PhoneAuthProvider.credential(
      verificationId,
      verificationCode
    );

    if (credential) {
      return credential;
    } else {
      return null;
    }
  }

  async function totpGenerateSecret() {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/totp_setup"
      );

      return res.data.response;
    } catch (error) {
      console.log(error);
    }
  }

  async function totpVerify(secret, token) {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/totp_verify",
        {
          secret,
          token,
        }
      );

      return res.data.response.isVerified;
    } catch (error) {
      console.log(error);
    }
  }

  // Firestore Methods
  async function addUserToDatabase(
    role,
    firstName,
    lastName,
    dob,
    gender,
    address,
    phoneNumber,
    nid,
    phoneVerifiedCredential
  ) {
    const user = firebaseAuth.getAuth().currentUser;
    const email = user.email;

    const userData = {
      email,
      firstName,
      lastName,
      dob,
      gender,
      address,
      phoneNumber,
      nid,
      role,
      reviews: [],
    };

    try {
      await firebaseAuth.updateProfile(currentUser, {
        displayName: `${firstName} ${lastName}`,
        // photoURL: null,
      });

      await firebaseAuth.updatePhoneNumber(
        currentUser,
        phoneVerifiedCredential
      );

      await firebaseFirestore.setDoc(
        firebaseFirestore.doc(firebaseDB, `users/${email}`),
        userData
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function addWorkerToDatabase(
    role,
    firstName,
    lastName,
    dob,
    gender,
    address,
    phoneNumber,
    nid,
    hiringOccupation,
    cvURL,
    isApproved,
    phoneVerifiedCredential
  ) {
    const user = firebaseAuth.getAuth().currentUser;
    const email = user.email;

    const workerData = {
      email,
      firstName,
      lastName,
      dob,
      gender,
      address,
      phoneNumber,
      nid,
      hiringOccupation,
      cvURL,
      isApproved,
      role,
      reviews: [],
    };

    try {
      await firebaseAuth.updateProfile(currentUser, {
        displayName: `${firstName} ${lastName}`,
        // photoURL: null,
      });

      await firebaseAuth.updatePhoneNumber(
        currentUser,
        phoneVerifiedCredential
      );

      await firebaseFirestore.setDoc(
        firebaseFirestore.doc(firebaseDB, `users/${email}`),
        workerData
      );
    } catch (error) {
      console.log(error);
    }
  }

  async function add2faLocatorToDatabase(locator) {
    const user = firebaseAuth.getAuth().currentUser;
    const email = user.email;

    const data = {
      locator,
    };

    const docRef = firebaseFirestore.doc(firebaseDB, `users/${email}`);

    try {
      const docSnap = await firebaseFirestore.getDoc(docRef);

      if (docSnap.exists()) {
        await firebaseFirestore.updateDoc(docRef, data);
      } else {
        console.log("Document does not exist!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchUserData() {
    const user = firebaseAuth.getAuth().currentUser;
    const email = user.email;

    const docRef = firebaseFirestore.doc(firebaseDB, `users/${email}`);

    try {
      const docSnap = await firebaseFirestore.getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Utility Methods
  async function redirectIfLoggedIn(navHook, redirectToLogin = false) {
    if (
      !firebaseAuth.getAuth().currentUser ||
      !localStorage.getItem("x-access-token")
    ) {
      if (redirectToLogin) {
        alert("You are not logged in!");
        navHook("/login");
      } else {
        return false;
      }
    } else {
      try {
        const userData = await fetchUserData();

        navHook(`/${userData.role}/dashboard`);
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function getUnapprovedWorkersData() {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL +
          "/users/get-unapproved-workers-data",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      return res.data.response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function getApprovedWorkersData() {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/users/get-approved-workers-data",
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      return res.data.response.data;
    } catch (error) {
      console.log(error);
    }
  }

  async function approveWorker(id) {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/users/approve-worker",
        {
          id,
        }
      );

      if (res.data.response) {
        const subject = "You are Approved as a Worker in Lok Lakbe!";

        const message = `Hi ${id}, hope this email finds you well.\n\nWe are happy to inform that our respective Admins approved you as a Worker in Lok Lagbe! Your CV was reviewed by our Admins. Now you will be able to use the portal. Just for your information, you can login into the portal with the **same** credentials you provided at registration. **NONE OF YOUR PERSONAL INFORMATION YOU PROVIDED WAS CHANGED!** So you **do not** need to register again. Again, thank you for your patience. If you have any further query, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Stay strong with **Lok Lagbe**!\n\nLokLagbe Team 💪`;

        await mailUser(subject, message, id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function rejectWorker(id) {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/users/reject-worker",
        {
          id,
        }
      );

      if (res.data.response) {
        const subject = "You are Declined by the Admins in Lok Lakbe!";

        const message = `Hi ${id}, it was nice meeting you.\n\nWe have a bad news for you! We are very sad to inform that our Admins denied your application as a Worker in Lok Lagbe! Your CV was reviewed by our Admins. For some reasons, you failed to make our Admins happy with your CV. Your account is deleted and the dashboard will be no more reachable to you. You can still apply later on if you want to and obviously better luck next time! Again, thank you for your patience. If you have any further query, please contact us at this email: **loklagbe.team@gmail.com**!\n\n### Thank you for staying with **Lok Lagbe**!\n\nLokLagbe Team 💪`;

        await mailUser(subject, message, id);
      }
    } catch (error) {
      console.log(error);
    }
  }

  function getRealtimePublicPosts() {
    const q = firebaseFirestore.query(
      firebaseFirestore.collection(firebaseDB, "posts")
      // firebaseFirestore.where("isPublic", "==", true)
      // firebaseFirestore.orderBy("createdAt", "desc"),
      // firebaseFirestore.limit(100)
    );

    const unsubscribe = firebaseFirestore.onSnapshot(q, (querySnapshot) => {
      const publicPosts = [];

      querySnapshot.forEach((doc) => {
        publicPosts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      localStorage.setItem("publicPosts", JSON.stringify(publicPosts));
    });

    return unsubscribe;
  }

  // Misc Methods
  async function mailUser(subject, message, email = null) {
    const user = firebaseAuth.getAuth().currentUser;
    let destEmail = user.email;

    if (email) {
      destEmail = email;
    }

    const mailData = {
      destEmail,
      subject,
      message,
    };

    try {
      await axios.post(process.env.REACT_APP_API_BASE_URL + "/mail", mailData);
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadCV(file) {
    const formData = new FormData();

    formData.append("file", file);

    try {
      let res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/cv_upload",
        formData
      );

      let data = res.data.response;

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async function encodeServiceAgreementData(payload) {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/encode",
        {
          payload,
          secret: "loklagbe.serviceagr",
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      return res.data.response.token;
    } catch (error) {
      console.log(error);
    }
  }

  async function decodeServiceAgreementToken(token) {
    try {
      const res = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/decode",
        {
          token,
          secret: "loklagbe.serviceagr",
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      return res.data.response.decoded;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      firebaseAuth.getAuth(),
      (user) => {
        console.log(user ? "User logged in" : "User logged out");

        setLoading(false);
        setCurrentUser(user);

        // setTimeout(() => {
        setPending(false);
        // }, 4000);
      }
    );

    return unsubscribe;
  }, []);

  if (pending) {
    return <LoadingScreen />;
  }

  const value = {
    currentUser,
    signupWithMail,
    loginWithMail,
    logout,
    resetPassword,
    loginWithGoogle,
    loginWithFacebook,
    createUserSession,
    checkSessionValidity,
    verifyPhoneWithCode,
    totpGenerateSecret,
    totpVerify,
    addUserToDatabase,
    addWorkerToDatabase,
    add2faLocatorToDatabase,
    fetchUserData,
    redirectIfLoggedIn,
    getUnapprovedWorkersData,
    getApprovedWorkersData,
    approveWorker,
    rejectWorker,
    getRealtimePublicPosts,
    mailUser,
    uploadCV,
    encodeServiceAgreementData,
    decodeServiceAgreementToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
