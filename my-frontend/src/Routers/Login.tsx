import React, {useContext, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";

import { ReactComponent as Logo } from "../assets/logo.svg";
import {AuthContext} from "../App";

const Login:React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormessage, setErrormessage] = useState("");

    const { auth ,setAuth} = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if(!email){
            setErrormessage("아이디(이메일)를 입력해주세요.");
            return;
        }

        if(!password){
            setErrormessage("비밀번호를 입력해주세요.");
            return;
        }

        try{
            const response = await axios.post("/api/user/login", {
                email: email,
                password: password,
            });

            //JWT 토큰을 로컬 스토리지에 저장
            //localStorage.setItem("token", response.data.token);
            //axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

            const {token, profileImage} = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("profileImage", profileImage);
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            //로그인 상태 업데이트(App.tsx)
            setAuth({
                isLoggedIn: true,
                profileImage,
                token,
            });

            setErrormessage("");
            navigate("/");
        }catch (error:any){
            setErrormessage("아이디(이메일) 또는 비밀번호가 틀렸습니다.");
        }
    };

    return(
        <div>
            <Link to="/">
                <Logo/>
            </Link>
            <h1>로그인</h1>
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errormessage && <p>{errormessage}</p>}
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
};

export default Login;