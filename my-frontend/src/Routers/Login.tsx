import React from "react";
import {Link} from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";

const Login:React.FC = () => {
    return(
        <div>
            <Link to="/">
                <Logo/>
            </Link>
            <h1>로그인</h1>
        </div>
    );
};

export default Login;