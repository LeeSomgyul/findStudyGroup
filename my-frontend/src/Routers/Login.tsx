import React, {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import axios from "axios";

const Login:React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errormessage, setErrormessage] = useState("");

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
            const response = await axios.post("/api/login", {
                email: email,
                password: password,
            });
            setErrormessage("");
            navigate("/login");
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