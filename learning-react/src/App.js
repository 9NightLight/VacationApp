import React from "react";
import SignIn from "./components/SignIn";
import Home from "./Home.js";
// import { auth } from './firebase.js';
// import { BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom';


//Clean console
  console.clear()
//

function App() {

  return (
    <div>
      <SignIn />
      <Home />
    </div>
  );
}

export default App;