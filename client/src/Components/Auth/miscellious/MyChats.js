import React, { useEffect, useState } from 'react'
import { ChatState } from './../../../Context/ChatProvider';
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import axios from "axios";
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './../ChatLoading';
import { getSender } from './../../../config/ChatLogics';
import GroupChatModal from './GroupChatModal';

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [logUser, setLogUser] = useState('');
  const toast = useToast();

  //access chats
  const fetchChats = async () => {
    try {

      const config = {
        'Content-Type': 'application/json',
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.get(`/api/chat`, config)
      console.log("all chats fetch:", data.result);
      console.log("Iam a user ", user.exists);
      setChats(data.result)


    } catch (error) {
      console.log("Erro in fetch Chats");
      toast({
        title: `Erro in fetchChats `,
        status: 'error',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
    }
  }

  //get sender
  useEffect(() => {
    console.log('chats:::::::::::::');
    let curr = JSON.parse(localStorage.getItem("userInfo"));
    setLogUser(curr.exists);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain])



  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      p={3}
      bg={'white'}
      w={{ base: '100%', md: '40%' }}
      borderRadius={'xl'}
      borderWidth={'5px'}>

      <Box
        display={'flex'}
        justifyContent={'space-between'}
        pb={3}
        px={3}
        fontSize={{ base: '18px', md: '26px' }}
        w={'100%'}
        alignItems={'center'}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={'flex'}
            fontSize={{ base: '17px', md: '12px', lg: '17px' }}
            rightIcon={<AddIcon />}
            m={1}
          >
            New Group Chats
          </Button>

        </GroupChatModal>

      </Box>
      <Box
        display={'flex'}
        flexDir={'column'}
        p={3}
        bg={'#F8F8F8'}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        overflowY={'hidden'}
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {chats.map((chat) => (
              <Box onClick={() => setSelectedChat(chat)
              }
                cursor={'pointer'}
                background={chat.isGroupChat === true ? 'teal' : '#E8E8E8'}
                color={selectedChat === chat ? 'orange' : 'black'}
                px={3}
                py={2}
                borderRadius={'lg'}
                key={chat._id}>
                <Text fontSize={'1xl'}
                  fontFamily={'Patua One'}>
                  {!chat.isGroupChat ? getSender(logUser, chat.users) : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box >
  )
}

export default MyChats;