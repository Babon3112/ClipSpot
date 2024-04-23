import React, { useState } from "react";
import styled from "styled-components";
import { mobile } from "../responsive";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../redux/apiCalls";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://source.unsplash.com/random") center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 800px;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0px 0px 10px rgb(255, 255, 255);

  ${mobile({ width: "75%", height: "85%" })}
`;

const Title = styled.h1`
  text-align: center;
  font-size: 28px;
  margin: 0;
  font-weight: 400;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 10px;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const Div = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CoverImageInput = styled.input`
  display: none;
`;

const CoverImageLabel = styled.label`
  cursor: pointer;
  text-align: center;
`;

const CoverImagePreview = styled.img`
  width: 750px;
  height: 150px;
  object-fit: cover;
  margin: 10px 0;
  border-radius: 1rem;
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarLabel = styled.label`
  cursor: pointer;
  text-align: center;
`;

const AvatarPreview = styled.img`
  width: 125px;
  height: 125px;
  border-radius: 50%;
  object-fit: cover;
`;

const Agreement = styled.span`
  font-size: 12px;
  margin: 10px 0;
  color: #555;
  text-align: center;
`;

const ButtonMiddle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 0;
  color: white;
  background-color: #007bff;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: all 0.3s ease;

  &:hover {
    background-color: #0066ff;
  }

  ${mobile({ width: "60%" })}
`;

const SignInLink = styled.p`
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #333;
  text-decoration: underline;
  cursor: pointer;
`;

const Register = () => {
  const [coverImage, setCoverImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and confirm password do not match");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("avatar", coverImage);

    try {
      await register(dispatch, formData).then(() => navigate("/login"));
    } catch (error) {}
  };

  const gotologin = () => {
    navigate("/login");
  };

  return (
    <Container>
      <Wrapper>
        <Title>CREATE AN ACCOUNT</Title>
        <Form>
          <Div>
            {coverImage ? (
              <CoverImageLabel>
                <CoverImageInput
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                />
                <CoverImagePreview
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar Preview"
                />
              </CoverImageLabel>
            ) : (
              <CoverImageLabel>
                <CoverImagePreview src="https://res.cloudinary.com/arnabcloudinary/image/upload/v1713880104/VidVerse/CoverImage/cover-image.jpg" />
                <CoverImageInput
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </CoverImageLabel>
            )}
          </Div>
          <Div>
            {avatar ? (
              <AvatarLabel>
                <AvatarInput
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
                <AvatarPreview
                  src={URL.createObjectURL(avatar)}
                  alt="Avatar Preview"
                />
              </AvatarLabel>
            ) : (
              <AvatarLabel>
                <AvatarPreview src="https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png" />
                <AvatarInput
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </AvatarLabel>
            )}
          </Div>
          <Input
            name="full-name"
            type="text"
            placeholder="Full name"
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            name="user-name"
            type="text"
            placeholder="Username"
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            name="email-"
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            name="confirm-password"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Agreement>
            By creating an account, I consent to the processing of your personal
            data in accordance with the <b>PRIVACY POLICY</b>
          </Agreement>
          <ButtonMiddle>
            <Button onClick={handleRegister}>
              {/* {loading ? "Creating..." : "Create an Account"} */}
              Create an Account
            </Button>
          </ButtonMiddle>
        </Form>
        <SignInLink onClick={gotologin}>
          Already have an account? Sign in
        </SignInLink>
      </Wrapper>
    </Container>
  );
};

export default Register;
