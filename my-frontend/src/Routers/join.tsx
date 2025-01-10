import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const JoinForm: React.FC = () => {
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

    const navigate = useNavigate();

    /*가입하기 버튼*/
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //유효성 검사를 통과하지 못한 경우
        if(emailError || passwordError || confirmPasswordError || phoneError || nameError || birthDateError || nicknameError){
            alert("입력값을 확인해주세요.");
            return;
        }

        //유효성 검사를 통과한 경우
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("name", name);
        formData.append("birthDate", birthDate);
        formData.append("nickname", nickname);
        if(profileImage){
            formData.append("profileImage", profileImage);
        }

        try{
            const response = await axios.post("/api/userRegister", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if(response.status == 201){
                alert("회원가입이 완료되었습니다.");

                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setPhone("");
                setName("");
                setBirthDate("");
                setNickname("");
                setProfileImage(null);

                navigate("/");
            }
        }catch (error){
            console.error("회원가입 요청 중 오류 발생: ", error);
            alert("회원가입 중 오류가 발생하였습니다. 다시 시도해주세요.");
        }
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
                <button type="button" onClick={handleEmailCheck}>
                    중복확인
                </button>
                {emailError && <p>{emailError}</p>}
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
                <button type="button" onClick={handlePhoneVerification}>
                    인증하기
                </button>
                {phoneError && <p>{phoneError}</p>}
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
                <button type="button" onClick={handleNicknameCheck}>
                    중복확인
                </button>
                {nicknameError && <p>{nicknameError}</p>}
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

export default JoinForm;