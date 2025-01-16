import React, {useState, useEffect, useRef} from "react";
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
    const [isEmailCheck, setIsEmailCheck] = useState(false);
    const [isNicknameCheck, setIsNicknameCheck] = useState(false);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const birthDateRef = useRef<HTMLInputElement>(null);
    const nicknameRef = useRef<HTMLInputElement>(null);

    /*아이디(이메일) 및 닉네임 값이 바뀔때마다 실행*/
    useEffect(() => {
        setIsEmailCheck(false)
    }, [email]);

    useEffect(() => {
        setIsNicknameCheck(false)
    }, [nickname]);

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

    /*아이디(이메일) 중복확인 버튼*/
    const handleEmailCheck = async() => {
        if(!email){
            alert("아이디(이메일)을 입력해주세요.");
            return;
        }
        try{
            const response = await axios.get(`/api/checkEmail`, {
                params: {email},
            });
            alert(response.data);
            setIsEmailCheck(true);
        }catch (error){
            if(axios.isAxiosError(error)){
                alert(error.response?.data);
            }else{
                alert("중복 확인 중 오류가 발생하였습니다.");
            }
            setIsEmailCheck(false);
        }
    };

    /*닉네임 중복확인 버튼*/
    const handleNicknameCheck = async() => {
        if(!nickname){
            alert("이메일을 입력해주세요.");
            return;
        }
        try{
            const response = await axios.get(`/api/checkNickname`, {
                params: {nickname},
            });
            alert(response.data);
            setIsNicknameCheck(true);
        }catch (error){
            if(axios.isAxiosError(error)){
                alert(error.response?.data);
            }else{
                alert("중복 확인 중 오류가 발생하였습니다.");
            }
            setIsNicknameCheck(false);
        }
    };

    const handlePhoneVerification = () => {

    };

    const navigate = useNavigate();

    /*가입하기 버튼*/
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        //빈칸이 있을 경우
        if(!email){
            alert("아이디(이메일)을 입력해주세요.");
            emailRef.current?.focus();
            return;
        }

        if(!password){
            alert("비밀번호를 입력해주세요.");
            passwordRef.current?.focus();
            return;
        }

        if(!confirmPassword){
            alert("비밀번호 확인을 입력해주세요.");
            confirmPasswordRef.current?.focus();
            return;
        }

        if(!phone){
            alert("휴대폰 번호를 입력해주세요.");
            phoneRef.current?.focus();
            return;
        }

        if(name){
            alert("이름을 입력해주세요.");
            nameRef.current?.focus();
            return;
        }

        if(!birthDate){
            alert("생년월일을 입력해주세요.");
            birthDateRef.current?.focus();
            return;
        }

        if(!nickname){
            alert("닉네임을 입력해주세요.");
            nicknameRef.current?.focus();
            return;
        }

        //비밀번호와 비밀번호 확인이 다른 경우
        if(password !== confirmPassword){
            alert("비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        //'중복확인'을 하지 않은 경우
        if(!isEmailCheck || !isNicknameCheck){
            alert("아이디(이메일) 또는 닉네임 중복확인을 해주세요.");
            return;
        }

        //유효성 검사를 통과하지 못한 경우
        if(emailError || passwordError || confirmPasswordError || phoneError || nameError || birthDateError || nicknameError){
            alert("입력값을 확인해주세요.");
            return;
        }

        //유효성 검사를 통과한 경우
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify({
            email, password, phone, name, birthDate, nickname,
        })],{ type: "application/json" }));
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
            }else{
                console.error("예상치 못한 응답 코드: ", response.status);
                alert("회원가입 요청이 정상적으로 처리되지 않았습니다. 잠시 후 다시 시도해주세요.");
            }
        }catch (error: any){
            //오류 종류 확인
            if (error.response) {
                // 서버가 응답했지만 상태 코드가 2xx 범위를 벗어난 경우
                console.error("서버 응답 오류:", error.response.data);
                const errorMessage = error.response.data || "회원가입 요청이 실패했습니다.";
                alert(errorMessage);
            } else if (error.request) {
                // 요청이 전송되었으나 응답이 없을 경우
                console.error("서버 응답 없음:", error.request);
                alert("서버와의 연결에 실패했습니다. 네트워크 상태를 확인해주세요.");
            } else {
                // 다른 오류 (예: 코드 문제)
                console.error("알 수 없는 오류 발생:", error.message);
                alert("알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            }
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