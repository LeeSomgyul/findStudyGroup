import { createBrowserRouter }from "react-router-dom";

import App from "./App";
import Home from "./Routers/Home";
import FindStudy from "./Routers/FindStudy";
import MySpace from "./Routers/MySpace";
import Community from "./Routers/Community";
import Event from "./Routers/Event";
import Login from "./Routers/Login";
import Join from "./Routers/join";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <Home/>},
            {path: "find-study", element: <FindStudy/>},
            {path: "my-space", element: <MySpace/>},
            {path: "community", element: <Community/>},
            {path: "event", element: <Event/>},
        ],
    },
    //Navbar 없는 페이지
    {path: "login", element: <Login/>},
    {path: "signup", element: <Join/>},
]);

export default router;