import React from 'react'
import { Badge, Stack } from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

const UserBadgeItem = ({ user, handelFunction }) => {
  return (

    <Badge variant='solid' colorScheme='green'
      fontSize={12}
      px={3}
      py={1}
      borderRadius={'lg'}
      mt={2}
      mb={2}
      onClick={handelFunction}
    >{user.name}<CloseIcon pl={1} pb={0.5}
      /></Badge>
  )
}

export default UserBadgeItem