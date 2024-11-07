
import './App.css'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './pages/home';
import Rooms from './pages/Room';
import SignIn from './pages/SignIn';
import { UserProvider } from './user-context.tsx';

function App() {

  return (
   <UserProvider>
    <Router>
       <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/room' element={<Rooms/>}/>
      </Routes>
    </Router> 
    </UserProvider>

  )
}

export default App
