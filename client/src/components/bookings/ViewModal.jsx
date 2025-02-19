import { useState } from "react";

import { Box, Button, Center, Container, Flex, Menu, MenuItem, MenuList, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Text } from "@chakra-ui/react";

export const ViewModal = ({ isOpen, onClose, setCurrentModal, classData }) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };

  const enterEditMode = () => {
    setCurrentModal("edit");
  }

  const [classTitle, setClassTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex>
          <Container centerContent>
            <ModalHeader>{classData.title}</ModalHeader>
            <Menu>
              <Button onClick={enterEditMode}>
                ...
              </Button>
              <MenuList>
                <MenuItem value="edit">Edit</MenuItem>
                <MenuItem value="delete">Delete</MenuItem>
              </MenuList>
            </Menu>
          </Container>
        </Flex>
        <ModalCloseButton />
        <ModalBody>
          <Flex gap="40" justify="center">
            <div>
              <Text fontWeight='bold' mb='1rem'>
                Location
              </Text>
              <Text>
                {classData.location}
              </Text>
            </div>
            <div>
              <Text fontWeight='bold' mb='1rem'>
                Date
              </Text>
              <Text>
                {classData.date}
              </Text>
            </div>
          </Flex>
          <Container centerContent>
            <Box bg="gray.200" h="100%" w="100%" p="4">
              <Box bg="gray" h="100%" w="100%" p="4" color="white">
                <Center>
                  <Text fontWeight='bold' mb="60">
                    QR
                  </Text>
                </Center>
                <Center>
                  <Button colorScheme='blue' mr={3}>
                      Share
                  </Button>
                </Center>
              </Box>
              <Text fontWeight='bold'>
                19 people RSVP'd
              </Text>
            </Box>
          </Container>
          <Box>
            <Text fontWeight='bold' mb='1rem'>
              Time
            </Text>
            <Text>
              {classData.startTime} - {classData.endTime}
            </Text>
          </Box>
          <Box>
            <Text fontWeight='bold' mb='1rem'>
              Description
            </Text>
            <Text>
              {classData.description}
            </Text>
          </Box>
          <Flex gap="40" justify="center">
            <div>
              <Text fontWeight='bold' mb='1rem'>
                Capacity
              </Text>
              <Text>
                {classData.capacity}
              </Text>
            </div>
            <div>
              <Text fontWeight='bold' mb='1rem'>
                Level
              </Text>
              <Text>
                {classData.level}
              </Text>
            </div>
          </Flex>
          {/* <Box>
            <Text fontWeight='bold' mb='1rem'>
              Performances
            </Text>
            <Text>
              {performances}
            </Text>
          </Box> */}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onCancel}>
            Cancel
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
