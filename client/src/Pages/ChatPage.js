import React, { useState } from 'react'
import { ChatState } from './../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/Auth/SideDrawer';
import MyChats from '../Components/Auth/miscellious/MyChats';
import ChatBox from '../Components/Auth/miscellious/ChatBox';


const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: '100%' }}>
      {
        user
        && <SideDrawer />
      }
      <Box
        display={'flex'}
        justifyContent={'space-between'}
        w={'100%'}
        h={'91.5vh'}
        p={'1rem'}>
        {user
          && <MyChats fetchAgain={fetchAgain} />}

        {user
          && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>
    </div>
  )
}

export default ChatPage