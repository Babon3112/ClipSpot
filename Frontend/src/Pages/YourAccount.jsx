import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../Components/Navbar";
import { mobile } from "../responsive";
import { updateAccount } from "../redux/apiCalls";
import { useDispatch, useSelector } from "react-redux";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 1rem rgba(255, 255, 255, 0.1);
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
  border-radius: 1rem;
  margin: 20px;
  object-fit: cover;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1);
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarLabel = styled.label`
  cursor: pointer;
  text-align: center;
`;

const AvatarPreview = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 20px;
  object-fit: cover;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  width: 400px;
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  background-color: #f5f5f5;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
  }

  ${mobile({ width: "80%" })}
`;

const SubmitButton = styled.button`
  width: 200px;
  padding: 15px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  color: #fff;
  background-color: #007bff;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0066ff;
  }
`;

const YourAccount = () => {
  const userDetails = useSelector((state) => state.user.currentUser.data.user);

  const [coverImage, setCoverImage] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [fullName, setFullName] = useState(userDetails.fullName);
  const [userName, setUserName] = useState(userDetails.userName);
  const [email, setEmail] = useState(userDetails.email);
  const dispatch = useDispatch();

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const isValidEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const formData = new FormData();
    if (fullName !== userDetails.fullName)
      formData.append("fullName", fullName);
    if (userName !== userDetails.userName)
      formData.append("userName", userName);
    if (email !== userDetails.email) formData.append("email", email);
    if (avatar) formData.append("avatar", avatar);
    if (coverImage) formData.append("coverImage", coverImage);

    try {
      await updateAccount(dispatch, formData).then(() =>
        window.location.reload()
      );
    } catch (error) {}
  };

  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Div>
          <CoverImageLabel>
            {coverImage ? (
              <CoverImagePreview src={URL.createObjectURL(coverImage)} />
            ) : (
              <CoverImagePreview
                src={
                  userDetails.coverImage ||
                  "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713880104/VidVerse/CoverImage/cover-image.jpg"
                }
              />
            )}
            <CoverImageInput
              type="file"
              id="CoverImage"
              accept="image/*"
              onChange={handleCoverImageChange}
            />
          </CoverImageLabel>
          <AvatarLabel>
            {avatar ? (
              <AvatarPreview src={URL.createObjectURL(avatar)} />
            ) : (
              <AvatarPreview
                src={
                  userDetails.avatar ||
                  "https://res.cloudinary.com/arnabcloudinary/image/upload/v1713075500/EazyBuy/Avatar/upload-avatar.png"
                }
              />
            )}
            <AvatarInput
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
            />
          </AvatarLabel>
          <Input
            type="text"
            id="Full name"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            type="text"
            id="username"
            placeholder="User Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <SubmitButton onClick={handleUpdate}>Update Details</SubmitButton>
        </Div>
      </Wrapper>
    </Container>
  );
};

export default YourAccount;
