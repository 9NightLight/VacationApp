import React from "react";
import SignIn from "./components/Registation/SignIn";
import Home from "./Home.js";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';


//Clean console
  console.clear()
//

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/auth" element={<SignIn />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
  );
}

export default App;