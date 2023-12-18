import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { ViewIcon } from '@chakra-ui/icons'

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {
        children ? <span onClick={onOpen}>{children}</span> : (
          <IconButton
            display={{ base: 'flex' }}
            icon={<ViewIcon />}
            onClick={onOpen} />
        )
      }

      <Modal size={'lg'} isOpen={isOpen} onClose={onClose}
        isCentered>
        <ModalOverlay />
        <ModalContent h={'25rem'}>
          <ModalHeader
            fontSize={'40px'}
            fontFamily={"Patua One"}
            display={'flex'}
            justifyContent={'center'}>{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Image
              borderRadius={'full'}
              boxSize={'150px'}
              src={user?.pic}
              alt='Image here'
              mb={2} />
            <Text
              fontSize={{ base: '28px', md: '30px' }}
              fontFamily={"Patua One"}>
              Email : {user?.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={2} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </>
  )
}

export default ProfileModal