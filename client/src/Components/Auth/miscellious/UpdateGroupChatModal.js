import React, { useState } from 'react'
import { useDisclosure, IconButton, Button, useToast, Box, Stack, FormControl, Input } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { ViewIcon } from '@chakra-ui/icons';
import { ChatState } from '../../../Context/ChatProvider';
import UserBadgeItem from './../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from './../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure()

  //usertodelet
  // const handelDelete = async (delUser) => {
  //   setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id))
  //   console.log("After deletion :", selectedUser);

  // }

  //rename



  const handelRename = async () => {

    if (!groupChatName) {
      toast({
        title: `Add text to update `,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      return
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }
      const { data } = await axios.put(`/api/chat/rename`, {
        chatId: selectedChat._id, chatName: groupChatName
      }, config);

      setSelectedChat(data.updatedChat);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: `error in rename name`,
        status: 'error',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      setRenameLoading(false)
      setGroupChatName("")


    }

  }

  //search the users
  const handelSearch = async (query) => {
    if (!query) {
      toast({
        title: `Write name to add `,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      setLoading(false)
      return
    }
    setSearch(query);

    try {
      setLoading(true);
      // console.log(user.token);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false)
      //set the search users u can access 
      setSearchResult(data.users);
      console.log("Founded in UpdatedGroupModal : ", data);

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

  //remove
  const handelRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user.exists._id &&
      user1._id !== user.exists._id) {
      toast({
        title: `Only admin Remove `,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      return
    }

    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.put(`/api/chat/groupremove`, {
        chatId: selectedChat._id,
        userId: user1._id
      }, config);

      //set the search users u can access 
      user1._id === user.exists._id ?
        setSelectedChat() :
        setSelectedChat(data)
      setFetchAgain(!fetchAgain);
      fetchMessage();
      setLoading(false)

    } catch (error) {

    }
  }

  //add user to group
  const handelGroup = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: `User already added `,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      return
    }

    if (selectedChat.groupAdmin._id !== user.exists._id) {
      toast({
        title: `Only admin can add users `,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      return
    } try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.put(`/api/chat/groupadd`, {
        chatId: selectedChat._id,
        userId: user1._id
      }, config);

      //set the search users u can access 
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false)
    } catch (error) {
      toast({
        title: `Error in adding user `,
        status: 'error',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
    }
  }



  return (
    <>
      <IconButton
        display={{ base: 'flex' }}
        icon={<ViewIcon />}
        onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={'35px'}
            fontFamily={'Patua One'}
            display={'flex'}
            justifyContent={'center'}>{selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Stack w={'100%'} direction={'row'} display={'flex'}
                cursor={'pointer'}>
                {selectedChat.users.map((s) => (
                  <UserBadgeItem
                    key={s._id}
                    user={s}
                    handelFunction={() => handelRemove(s)} />
                ))}
              </Stack>
            </Box>
            <FormControl
              mt={3}>

              <Input
                placeholder='Update name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
                onClick={handelRename}

              />
              <Input
                placeholder='Add Users eg: Chris, Sam'
                onChange={(e) => handelSearch(e.target.value)} />
            </FormControl>
            {loading ? <div>Loading User...</div>
              : (
                searchResult.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handelFunction={() => handelGroup(user)}
                  />

                ))
              )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red'
              mr={3}
              onClick={() => handelRemove(user)}
              isLoading={renameloading}
            >
              Leave Group
            </Button>
            <Button colorScheme='teal'
              mr={3}
              onClick={handelRename}
              isLoading={renameloading}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal