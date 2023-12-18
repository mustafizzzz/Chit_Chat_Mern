import { Avatar, Box, Text } from '@chakra-ui/react'
import React from 'react'

const UserListItem = ({ user, handelFunction }) => {
  return (
    <Box
      onClick={handelFunction}
      cursor={'pointer'}
      bg={'#E8E8E8'}
      _hover={{
        background: '#38B2AC',
        color: 'white'
      }}
      w={'100%'}
      display={'flex'}
      alignItems={'center'}
      color={'black'}
      px={3}
      py={2}
      mt={3}
      mb={3}
      borderRadius={'lg'}>
      <Avatar
        mr={2}
        size={'sm'}
        cursor={'pointer'}
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize={'xs'}><b>Email: </b>{user.email}
        </Text>
      </Box>
    </Box>

  );
};

export default UserListItem;