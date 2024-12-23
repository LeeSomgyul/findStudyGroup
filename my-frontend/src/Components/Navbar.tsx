import React from "react";
import {Link} from "react-router-dom";
import { ReactComponent as Logo } from "../assets/logo.svg";

const Navbar: React.FC = () => {
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
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
            </div>
        </nav>
    );
};

export default Navbar;