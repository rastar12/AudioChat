import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from "../user-context";
import { v4 as uuidv4 } from 'uuid'; 
export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { setUser, setClient } = useUser();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const userData = {
        id: uuidv4(), 
        username: result.user.email,
        name: result.user.displayName,
        image: result.user.photoURL,
      };

      console.log("User Data:", userData);

      const res = await fetch("http://localhost:3001/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error from backend:", errorData);
        throw new Error("Failed to fetch token");
      }

      const data = await res.json();
      console.log("Response from backend:", data);

      const user: User = {
        id: data.id,
        name: data.name,
      };

      const myClient = new StreamVideoClient({
        apiKey: "ep6kancczz9d",
        user,
        token: data.token,
      });

      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      cookies.set("token", data.token, { expires });
      cookies.set("username", userData.username, { expires });
      cookies.set("name", userData.name, { expires });

      setClient(myClient);
      setUser({ name: userData.name, username: userData.username });


      navigate("/");
    } catch (error) {
      console.error("Could not sign in with Google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="w-full py-2 px-4 bg-white hover:bg-gray-100 rounded-md shadow-lg text-gray-800 font-semibold transition duration-200"
    >
      Sign in with Google
    </button>
  );
}
