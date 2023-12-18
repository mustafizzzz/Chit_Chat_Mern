import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputRightElement, VStack, InputGroup, useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChatState } from '../../Context/ChatProvider';


const Signup = () => {
  const [name, setName] = useState();
  const [email, setEamil] = useState();
  const [password, setPassword] = useState();
  const [confrimpassword, setConfrimPassword] = useState();
  const [picture, setPicture] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setUser } = ChatState();
  const navigate = useNavigate();


  //handelClick
  const handelClick = () => {

    setShow(!show);
  }

  //post details
  const postDetails = async (pics) => {

    setLoading(true);
    if (pics === undefined) {

      toast({
        title: 'Please Select an Image',
        description: "warning",
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      })
      return;
    }

    if (pics.type === 'image/jpeg' || pics.type === 'image/png') {
      const data = new FormData();
      data.append("file", pics);
      data.append("uploade_preset", "chatapp");
      data.append("cloud_name", "dzhhwcgy3");

      await fetch("https://api.cloudinary.com/v1_1/dzhhwcgy3/image/uploade", {
        headers: { "Content-Type": "multipart/form-data" },
        method: "POST",
        body: data,
      }).then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          setLoading(false)
        }).catch((error) => {
          console.log(error);
          setLoading(false)
        });

    } else {

      toast({
        title: 'Invalid Image',
        description: "warning",
        status: 'error',
        duration: 5000,
        position: 'top',
        isClosable: true,
      })
      setLoading(false)
      return;

    }

  }

  const submitHandel = async () => {
    setLoading(true);
    if (!name || !password || !email || !confrimpassword) {
      toast({
        title: 'Please Fill all details',
        description: "warning",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
      return;
    }

    if (password !== confrimpassword) {
      toast({
        title: 'Password do not Match',
        description: "warning",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
      return;
    }

    try {

      const config = {
        header: {
          "Content-type": "applicatin/json",
        },
      }

      const { data } = await axios.post(`/api/user`, { name, email, password }, config);

      toast({
        title: 'Registration Successfull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      });
      setUser(data)
      localStorage.setItem('userInfo', JSON.stringify(data));
      setName("");
      setEamil("");
      setPassword("");
      setConfrimPassword("");
      setLoading(false);
      // navigate('/');


    } catch (error) {
      console.log("Erro in catch of submitHandel  ", error);

    }
  }

  return (
    <VStack spacing={'8px'}>

      <FormControl id='firts-name' isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type='text'
          value={name}
          placeholder='Enter Your Name'
          onChange={(e) => setName(e.target.value)}></Input>
      </FormControl>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          value={email}
          placeholder='Enter Your Email'
          onChange={(e) => setEamil(e.target.value)}></Input>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            value={password}
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handelClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='confrimpassword' isRequired>
        <FormLabel>Confrim password</FormLabel>
        <InputGroup>
          <Input
            type={show ? 'text' : 'password'}
            value={confrimpassword}
            placeholder='confrim password'
            onChange={(e) => setConfrimPassword(e.target.value)} />
          <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handelClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl id='pic' isRequired>
        <FormLabel>Uploade you Picture</FormLabel>
        <Input
          type='file'
          p={1}
          h={10}
          accept='image/*'
          placeholder='Uploade'
          onChange={(e) => postDetails(e.target.files[0])}></Input>
      </FormControl>

      <Button
        colorScheme='green'
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandel}
        isLoading={loading}>
        Sign Up
      </Button>


    </VStack >
  )
}

export default Signup