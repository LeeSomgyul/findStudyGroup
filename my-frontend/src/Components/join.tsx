import React, {useState} from "react";

const joinForm: React.FC = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthDateError, setBirthDateError] = useState("");
    const [nickname, setNickname] = useState("");
    const [nicknameError, setNicknameError] = useState("");
    const [profileImage, setProfileImage] = useState("");


    /*유효성 검사*/
    const validateEmail = {

    };

    const validatePassword = {

    };

    const validateConfirmPassword = {

    };

    const validateNickname = {

    }

    const validatePhone = {

    }

    const validateName = {

    }

    const validateBirthDate = {

    }

    /*중복확인 버튼*/
    const handleEmailCheck = () => {

    };

    const handleNicknameCheck = () => {

    };

    const handlePhoneVerification = () => {

    };

    /*가입하기 버튼*/
    const handleSubmit = (e: React.FormEvent) => {

    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>회원가입</h1>

            <div>
                <label>아이디(이메일)</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={validateEmail}
                />
                {emailError && <p>{emailError}</p>}
                <button type="button" onClick={handleEmailCheck}>
                    중복확인
                </button>
            </div>

            <div>
                <label>비밀번호</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={validatePassword}
                />
                {passwordError && <p>{passwordError}</p>}
            </div>

            <div>
                <label>비밀번호 확인</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onBlur={validateConfirmPassword}
                />
                {confirmPasswordError && <p>{confirmPasswordError}</p>}
            </div>

            <div>
                <label>휴대폰</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onBlur={validatePhone}
                />
                {phoneError && <p>{phoneError}</p>}
                <button type="button" onClick={handlePhoneVerification}>
                    인증하기
                </button>
            </div>

            <div>
                <label>이름(실명)</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                />
                {nameError && <p>{nameError}</p>}
            </div>

            <div>
                <label>생년월일(8자리)</label>
                <input
                    type="text"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    onBlur={validateBirthDate}
                />
                {birthDateError && <p>{birthDateError}</p>}
            </div>

            <div>
                <label>닉네임</label>
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    onBlur={validateNickname}
                />
                {nicknameError && <p>{nicknameError}</p>}
                <button type="button" onClick={handleNicknameCheck}>
                    중복확인
                </button>
            </div>

            <div>
                <label>프로필</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if(e.target.files) {
                            setProfileImage(e.target.files[0]);
                        }
                    }}
                />
            </div>

            <button type="submit">
                가입하기
            </button>

        </form>
    );
};

export default joinForm;