import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Cookies from "universal-cookie";
import { StreamVideoClient, User } from "@stream-io/video-react-sdk";
import { useUser } from '../user-context'; 

export default function GoogleSignInButton() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { setUser, setClient } = useUser(); // Destructure setUser and setClient from useUser

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      // Consolidate data into an object
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      // Send the consolidated user data to the backend
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch token");
      }

      const data = await res.json();
      console.log(data);

      const user: User = {
        id: userData.email, // Using email as the user ID, you may want to adjust this based on your design
        name: userData.name,
      };

      // Initialize Stream Video Client with the token
      const myClient = new StreamVideoClient({
        apiKey: import.meta.env.VITE_API_KEY,
        user,
        token: data.token, // Make sure the token is available in data
      });

      // Set cookie expiration
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      // Store token and user data in cookies
      cookies.set("token", data.token, { expires });
      cookies.set("username", userData.email, { expires }); // Ensure you're setting the username correctly
      cookies.set("name", userData.name, { expires });

      // Set the user and client in context
      setClient(myClient);
      setUser({ name: userData.name, username: userData.email }); // Adjust as necessary

      // Redirect to the main page after successful sign-in
      navigate('/');
   
    } catch (error) {
      console.error('Could not sign in with Google', error);
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
