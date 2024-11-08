import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./pages/home.tsx";
import SignIn from './pages/SignIn.tsx';
import Room from "./pages/Room";
import { StreamCall } from "@stream-io/video-react-sdk";
import { useUser } from "./user-context";
import Cookies from "universal-cookie";

// You can import an image directly or use a URL
import backgroundImage from './assets/background1.jpg'; 

export default function App() {
  const { call, setUser, setCall } = useUser();
  const cookies = new Cookies();

  return (
    <Router>
      <div
        className="min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }} 
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route
            path="/room/:roomId"
            element={
              call ? (
                <StreamCall call={call}>
                  <Room />
                </StreamCall>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
        <div>
          <button
            className="logout-button"
            onClick={() => {
              cookies.remove("token");
              cookies.remove("name");
              cookies.remove("username");
              setUser(null);
              setCall(undefined);
              window.location.pathname = "/sign-in";
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </Router>
  );
}
