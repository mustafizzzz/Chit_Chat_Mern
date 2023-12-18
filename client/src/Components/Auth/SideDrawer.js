import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent, Menu, MenuButton, MenuDivider, MenuItem, MenuList,
  Text, Tooltip, Input, useToast, Spinner
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from 'react'
import ProfileModal from './miscellious/ProfileModal';
import { ChatState } from '../../Context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/hooks";
import axios from 'axios'
import ChatLoading from './ChatLoading';
import UserListItem from './UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'




const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const { user, setSelectedChat, chats, setChats, notify, setNotify } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef();
  const toast = useToast();

  //logout handler
  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  }


  //search handler
  const handelSearch = async () => {
    if (!search) {
      toast({
        title: `Add some text `,
        status: 'warning',
        duration: 2000,
        position: 'top-left',
        isClosable: true,
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true);
      // console.log(user.token);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false)

      //set the searchbs users u can access 
      setResult(data.users);
      console.log("Founded : ", data);


    } catch (error) {
      console.log("Error in Search", error);
      toast({
        title: `Error in search`,
        status: 'error',
        duration: 2000,
        position: 'top-left',
        isClosable: true,
      })
      setLoading(false)

    }

  }


  //access chats
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        'Content-Type': 'application/json',
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.post(`/api/chat`, { userId }, config)
      console.log("access chats", data.FullChat);

      if (!chats.find((c) => c._id === data._id)) {
        setChats([data.FullChat, ...chats]);
      }
      console.log("chats in access: ", chats);
      setSelectedChat(data.FullChat);
      setLoadingChat(false);
      onClose();


    } catch (error) {
      console.log("Erro in accesschat");
      toast({
        title: `Erro in accesschat `,
        status: 'error',
        duration: 2000,
        position: 'top-left',
        isClosable: true,
      })
      setLoadingChat(false)

    }

  }


  return (
    <>
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        alignItems={'center'}
        bg={'white'}
        w={'98.2%'}
        m={'auto'}
        p={'5px 10px 5px 8px'}
        borderWidth={'5px'}
        borderRadius={'1rem'}>
        <Tooltip label="Search User to Chat"
          hasArrow
          placeItems={'bottom-end'}>
          <Button variant='ghost'
            colorScheme='teal'
            onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ base: "none", md: "flex" }}
              px={'4'}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          fontSize={'2xl'}
          fontFamily={'Patua One'}
          textAlign={'center'}
          me={2}>Chit-Chat</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notify.length}
                effect={Effect.SCALE} />
              <BellIcon fontSize={'2xl'} m={1} />
            </MenuButton>
            <MenuList padding={3}>
              <Button
                mb={3}
                w={'100%'}
                display={'block'}
                onClick={() => setNotify([])}>Clear</Button>
              {!notify.length && 'No new Message'}
              {notify.map(noti => (
                <MenuItem key={noti._id} onClick={() => {
                  setSelectedChat(noti.chat)
                  setNotify(notify.filter((n) => n !== noti))
                }}>
                  {noti?.chat?.isGroupChat ? `New Message in ${noti.chat.chatName}` : `New Message: ${getSender(user?.exists, noti.chat.users)}`}
                </MenuItem>
              ))}

            </MenuList>
          </Menu>
          <Menu>
            <MenuButton p={1} as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size={'sm'} cursor={'pointer'}
                name={user?.exists?.name} src={user?.exists?.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user?.exists}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal >
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>

        </div>
      </Box >
      <Drawer placement='left' onClose={onClose}
        isOpen={isOpen} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottom={'2px'}>Search User</DrawerHeader>
          <DrawerBody>
            <Box display={'flex'} pt={1}>
              <Input placeholder='Search by name or email' size='md'
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)} />
              <Button
                colorScheme='teal'
                variant='outline'
                onClick={handelSearch}
                isLoading={loading}>Go</Button>
            </Box>

            {loading ? (<ChatLoading />)
              : (
                result.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handelFunction={() => accessChat(user._id)}
                  />

                ))
              )}
            {loadingChat && <Spinner ml='auto' display={'flex'} />}
          </DrawerBody>
        </DrawerContent>

      </Drawer >
    </>
  )
}

export default SideDrawer