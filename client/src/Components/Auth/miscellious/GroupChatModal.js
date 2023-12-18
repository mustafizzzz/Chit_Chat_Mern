import React, { useState } from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast, Input, Box, Stack,
} from '@chakra-ui/react';
import { FormControl } from "@chakra-ui/form-control";
import { ChatState } from '../../../Context/ChatProvider';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';
import ChatLoading from './../ChatLoading';
import UserBadgeItem from './../UserAvatar/UserBadgeItem';



const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  //get all users by search
  const handelSearch = async (query) => {
    if (!query) {
      toast({
        title: `Add some text `,
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
      console.log("Founded in GroupModal : ", data);



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


  //handel submit 
  const handelSubmit = async () => {
    if (!groupChatName) {
      toast({
        title: `Fill All Details`,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      }

      const { data } = await axios.post(`/api/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUser.map((u) => u._id)),
      }, config);

      setChats([data, ...chats]);

      onClose();

      toast({
        title: `New Group Created`,
        status: 'success',
        duration: 3000,
        position: 'top',
        isClosable: true,
      })


    } catch (error) {
      console.log(error);
      toast({
        title: `Error in forming a Group`,
        status: 'error',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })

    }
  }


  //handel user 
  const handelGroup = async (usersToAdd) => {
    console.log(selectedUser);
    if (selectedUser.includes(usersToAdd)) {
      toast({
        title: `User already added `,
        status: 'warning',
        duration: 2000,
        position: 'top',
        isClosable: true,
      })
      return
    }

    setSelectedUser([...selectedUser, usersToAdd]);
    console.log("add this :", selectedUser);
  }


  //usertodelet
  const handelDelete = async (delUser) => {
    setSelectedUser(selectedUser.filter((sel) => sel._id !== delUser._id))
    console.log("After deletion :", selectedUser);

  }



  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={'28px'}
            fontFamily={'Patua One'}
            display={'flex'}
            justifyContent={'center'}>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}>

            <FormControl>
              <Input
                placeholder='Chat Name'
                mb={3}
                onClick={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder='Add Users eg: Chris, Sam'
                onChange={(e) => handelSearch(e.target.value)} />
            </FormControl>
            <Stack w={'100%'} direction={'row'} display={'flex'}
              cursor={'pointer'}>
              {selectedUser.map((s) => (
                <UserBadgeItem
                  key={s._id}
                  user={s}
                  handelFunction={() => handelDelete(s)} />
              ))}
            </Stack>
            {loading ? <div>Loading...</div>
              : (
                searchResult.slice(0, 4).map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handelFunction={() => handelGroup(user)}
                  />

                ))
              )}
            {/* Render Searched user */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' onClick={handelSubmit}>
              Create group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal