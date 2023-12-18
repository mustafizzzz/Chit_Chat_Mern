import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box, Text, IconButton, Spinner, FormControl, Input, useDisclosure, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import ProfileModal from './Auth/miscellious/ProfileModal';
import { getSender, getSenderFull } from '../config/ChatLogics';
import UpdateGroupChatModal from './Auth/miscellious/UpdateGroupChatModal';
import axios from 'axios';
import "../Components/styles.css";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";

const EndPoint = 'http://localhost:8080';
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState()
  const [soketConected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const { user, selectedChat, setSelectedChat, notify, setNotify } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
    },
  };

  //send message
  const sendMessage = async (event) => {
    if (event.key === 'Enter' && newMessage) {
      try {

        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          }
        }

        setNewMessage("");
        const { data } = await axios.post(`/api/message`, {
          content: newMessage,
          chatId: selectedChat._id,
        }, config)
        console.log(data);
        socket.emit('new message', data)
        setMessage([...message, data])


      } catch (error) {
        toast({
          title: `Add some text `,
          status: 'error',
          duration: 2000,
          position: 'top-left',
          isClosable: true,
        })
        setLoading(false)
      }

    }

  }

  //socket io
  useEffect(() => {
    socket = io(EndPoint);
    socket.emit('setup', user?.exists);
    socket.on('Connect', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true))
    socket.on('stop typing', () => setIsTyping(false))
    // eslint-disable-next-line
  }, [])


  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
    //eslint-disable-next-line
  }, [selectedChat])

  //bell alert
  useEffect(() => {
    socket.on('message received', (newMessageRec) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRec.chat._id) {
        //give notification
        if (!notify.includes(newMessageRec)) {
          setNotify([newMessageRec, ...notify])
          setFetchAgain(!fetchAgain)

        }
      } else {
        setMessage([...message, newMessageRec])

      }
    })
  })

  console.log("Notify: ", notify);


  //typing show
  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    // typing indicator
    if (!soketConected) {
      return;
    }

    if (!typing) {
      setTyping(true)
      socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime()
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false)

      }
    }, timerLength);


  }


  //fecth message
  const fetchMessage = async () => {
    if (!selectedChat) {
      return
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }
      setLoading(true)
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config)

      setMessage(data)
      setLoading(false)
      socket.emit('join chat', selectedChat._id);
      console.log("Fetch message : ", message);

    } catch (error) {
      console.log(error);
      toast({
        title: `Error in loading `,
        status: 'error',
        duration: 2000,
        position: 'top-left',
        isClosable: true,
      })
      setLoading(false)

    }

  }




  return (
    <>
      {
        selectedChat ? (
          <>
            <Text fontSize={{ base: '28px', md: '30px' }}
              pb={3}
              px={2}
              w={'100%'}
              fontFamily={'Patua One'}
              display={'flex'}
              justifyContent={{ base: 'space-between' }}
              alignItems={'center'}>
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")} />
              {!selectedChat.isGroupChat ? (
                <>

                  {getSender(user.exists, selectedChat.users)}

                  <ProfileModal user={getSenderFull(user.exists, selectedChat.users)} />
                </>
              ) : (<>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessage={fetchMessage} />

              </>)}

            </Text>
            <Box
              display={'flex'}
              flexDir={'column'}
              bg={'#E8E8E8'}
              p={3}
              w={'100%'}
              h={'100%'}
              borderRadius={'lg'}
              overflowY={'hidden'}
            >
              {loading ? (
                <Spinner
                  size={'xl'}
                  w={40}
                  h={40}
                  alignSelf={'center'}
                  margin={'auto'} />
              ) : (

                <div className='message'>
                  <ScrollableChat message={message} />
                </div>
              )
              }
              {isTyping ? (<div><Lottie
                options={defaultOptions}
                width={70}
                style={{ marginBottom: 15, marginLeft: 0 }}
              /></div>) : (<></>)}
            </Box>
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}>
              <Input placeholder='Enter a message... ' size='md'
                mr={2}
                bg={'#E0E0E0'}
                variant={'filled'}
                value={newMessage}
                onChange={typingHandler}
              />

            </FormControl>
          </>
        ) : (
          <Box display={'flex'} alignItems={'center'} justifyContent={'center'} h={'100%'} w={'100%'} >
            <Text fontSize={'4xl'}
              pb={3}
              fontFamily={'Patua One'}>Click on a user to start chatting </Text>

          </Box>

        )
      }
    </>
  )
}

export default SingleChat