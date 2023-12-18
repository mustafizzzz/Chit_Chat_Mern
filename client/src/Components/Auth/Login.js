import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputRightElement, VStack, InputGroup, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatState } from '../../Context/ChatProvider';


const Login = () => {

  const [email, setEamil] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setUser } = ChatState();
  const navigate = useNavigate();

  //handelClick
  const handelClick = () => {
    setShow(!show);
  }

  const submitHandel = async () => {
    setLoading(true);
    if (!password || !email) {
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

    try {
      const config = {
        header: {
          "Content-type": "application/json",
        }
      }
      const { data } = await axios.post(`/api/user/login`, { email, password }, config);

      toast({
        title: 'Login Successfull',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setUser(data)
      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false)
      navigate('/chats');

    } catch (error) {
      toast({
        title: 'Error in catch  of login',
        description: "warning",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'bottom',
      })
      setLoading(false)
      console.log("Erro in catch of submitHandel  ", error);

    }

  }


  return (
    <VStack spacing={'8px'}>

      <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type='email'
          placeholder='Enter Your Email'
          value={email}
          onChange={(e) => setEamil(e.target.value)}></Input>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? 'text' : 'password'}
            placeholder='password'
            onChange={(e) => setPassword(e.target.value)} />
          <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={handelClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='blue'
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={submitHandel}
        isLoading={loading}>
        Login
      </Button>

      <Button
        variant={'solid'}
        colorScheme='yellow'
        width={'100%'}
        mt={2}
        onClick={() => {
          setEamil("guest@gmail.com");
          setPassword("12345");
        }}>
        Get Guest User Credential
      </Button>


    </VStack >

  )
}

export default Login