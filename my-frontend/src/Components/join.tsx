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
    const [profileImage, setProfileImage] = useState<File|null>(null);

    /*유효성 검사*/
    const validateEmail = (e: React.FocusEvent<HTMLInputElement>) => {
        const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i;
        if(!email) {
            setEmailError("이메일을 입력해주세요.");
        }else if(!emailRegex.test(email)){
            setEmailError("올바른 이메일 형식이 아닙니다.");
        }else{
            setEmailError("");
        }
    };

    const validatePassword = (e: React.FocusEvent<HTMLInputElement>) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{5,15}$/;
        if(!password){
            setPasswordError("비밀번호를 입력해주세요.");
        }else if(!passwordRegex.test(password)){
            setPasswordError("비밀번호는 5~15자 이며, 특수문자, 영문자, 숫자가 각각 하나 이상 포함되어야 합니다.");
        }else{
            setPasswordError("");
        }
    };

    const validateConfirmPassword = (e: React.FocusEvent<HTMLInputElement>) => {
        if(!confirmPassword){
            setConfirmPasswordError("비밀번호 확인을 입력해주세요.");
        }else if(confirmPassword !== password){
            setConfirmPasswordError("비밀번호와 일치하지 않습니다.");
        }else{
            setConfirmPasswordError("");
        }
    };

    const validateNickname = (e: React.FocusEvent<HTMLInputElement>) => {
        const nicknameRegex = /^[^\s!@#$%^&*(),.?":{}|<>]{2,6}$/;
        if(!nickname){
            setNicknameError("닉네임을 입력해주세요.");
        }else if(!nicknameRegex.test(nickname)){
            setNicknameError("닉네임은 2~6자 이며, 특수문자나 공백이 포함될 수 없습니다.");
        }else{
            setNicknameError("");
        }
    }

    const validatePhone = (e: React.FocusEvent<HTMLInputElement>) => {
        const phoneRegex = /^\d{11}$/;
        if(!phone){
            setPhoneError("휴대전화를 입력해주세요.");
        }else if(!phoneRegex.test(phone)){
            setPhoneError("휴대전화는 숫자 11자리를 입력해야 합니다.");
        }else{
            setPhoneError("");
        }
    }

    const validateName = (e: React.FocusEvent<HTMLInputElement>) => {
        const nameRegex = /^[^\d!@#$%^&*(),.?":{}|<>\s]+$/;
        if(!name){
            setNameError("이름을 입력해주세요.");
        }else if(!nameRegex.test(name)){
            setNameError("이름에는 숫자, 특수문자 또는 공백이 포함될 수 없습니다.");
        }else{
            setNameError("");
        }
    }

    const validateBirthDate = (e: React.FocusEvent<HTMLInputElement>) => {
        const birthDateRegex = /^\d{8}$/;
        if(!birthDate){
            setBirthDateError("생년월일을 입력해주세요.");
        }else if(!birthDateRegex.test(birthDate)){
            setBirthDateError("생년월일은 숫자 8자리를 입력해야 합니다.");
        }else{
            setBirthDateError("");
        }
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