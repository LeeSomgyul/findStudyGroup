import React from 'react';
import {Outlet} from "react-router-dom";

import Navbar from "./Components/Navbar";

function App(){
  return(
      <div>
          <Navbar/>
          <div>
              <Outlet/>
          </div>
      </div>
  );
}

export default App;