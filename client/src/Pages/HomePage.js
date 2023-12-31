import React, { useEffect } from 'react'
import { Container, Box, Text, Tabs, Tab, TabPanels, TabPanel, TabList } from '@chakra-ui/react'
import Login from '../Components/Auth/Login'
import Signup from '../Components/Auth/Signup'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      navigate('/chats');
    }
  }, [navigate])
  return (
    <Container maxW={'xl'} centerContent>
      <Box
        d='flex'
        justifyContent='center'
        p={4}
        bg={'white'}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="2px"
      >
        <Text
          fontSize={'4xl'}
          fontFamily={'Patua One'}
          textAlign={'center'}
        >Chit-Chat</Text>
      </Box>

      <Box d='flex'
        justifyContent='center'
        p={4}
        bg={'white'}
        w="100%"
        m={'0px'}
        borderRadius="lg"
        borderWidth="2px">

        <Tabs variant='soft-rounded'>
          <TabList mb={'1em'}>
            <Tab width={'50%'}>Login</Tab>
            <Tab width={'50%'}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>


      </Box>
    </Container>
  )
}

export default HomePage