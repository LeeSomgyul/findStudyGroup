import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";
import {AuthContext} from "../App";
import axios from "axios";

const Navbar: React.FC = () => {
    const {auth, setAuth} = useContext(AuthContext);
    const {isLoggedIn, profileImage} = auth;

    const navigate = useNavigate();

    const handleLogout = () => {
        //로컬스토리지에 로그아웃한 사용자 토큰 및 프로필이미지 삭제
        localStorage.removeItem("userId");
        localStorage.removeItem("profileImage");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];

        //상태 초기화
        setAuth({
            isLoggedIn: false,
            userId: null,
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
                <Link to="/daily-calendar">캘린더</Link>
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