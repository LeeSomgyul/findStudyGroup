import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import {AuthContext} from "../App";
import axios from "axios";

const Navbar: React.FC = () => {
    const {auth, setAuth} = useContext(AuthContext);
    const {isLoggedIn, profileImage} = auth;

    console.log(auth);
    console.log(profileImage);

    const navigate = useNavigate();

    const handleLogout = () => {
        //로컬스토리지에 저장된 토큰 제거
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];

        //상태 초기화
        setAuth({
           isLoggedIn: false,
           profileImage: "",
           token: null,
        });

        navigate("/");
    };

    return(
        <nav>
            <div>
                <Link to="/">
                    <Logo/>
                </Link>
            </div>
            <div>
                <Link to="/find-study">스터디 찾기</Link>
                <Link to="/my-space">나의 학습 공간</Link>
                <Link to="/community">커뮤니티</Link>
                <Link to="/event">이벤트</Link>
            </div>
            <div>
                {isLoggedIn ? (
                    <>
                        <img
                            src={`http://localhost:8080${profileImage}`}
                            alt="Profile"
                            style={{ width: "40px", height: "40px", borderRadius: "50%" }}//예비설정
                        />
                        <Link to="/" onClick={handleLogout}>로그아웃</Link>
                    </>
                    ) : (
                    <>
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;