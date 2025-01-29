import { createBrowserRouter }from "react-router-dom";

import App from "./App";
import Home from "./Routers/Home";
import DailyCalendar from "./Routers/DailyCalendar";
import Login from "./Routers/Login";
import Join from "./Routers/join";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {path: "", element: <Home/>},
            {path: "daily-calendar", element: <DailyCalendar/>},
        ],
    },
    //Navbar 없는 페이지
    {path: "login", element: <Login/>},
    {path: "signup", element: <Join/>},
]);

export default router;