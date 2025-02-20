import { Box, Button, Center, Container, Flex, Menu, MenuItem, MenuList, MenuButton, Modal,
  ModalOverlay, ModalHeader, ModalContent, ModalBody, Text, 
  IconButton} from "@chakra-ui/react";

import { BsChevronLeft } from "react-icons/bs";

const dateToString = (date) => {
  if ((typeof date) !== "object")
    return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
};

const timeToString = (time) => {
  if ((typeof time) !== "object")
    return "";
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

export const ViewModal = ({ isOpen, onClose, setCurrentModal, classData }) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };

  const enterEditMode = () => {
    setCurrentModal("edit");
  }

  // const [classTitle, setClassTitle] = useState("");
  // const [location, setLocation] = useState("");
  // const [date, setDate] = useState("");
  // const [startTime, setStartTime] = useState("");
  // const [endTime, setEndTime] = useState("");
  // const [description, setDescription] = useState("");
  // const [capacity, setCapacity] = useState("");
  // const [level, setLevel] = useState("");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex align="center" w="100%" position="relative">
          <IconButton onClick={onClose} icon={<BsChevronLeft />} position="absolute" left={5} backgroundColor="white"/>
          <ModalHeader flex={1} textAlign="center">{classData.title}</ModalHeader>
          <Menu>
            <MenuButton as={Button} position="absolute" right={5}>
              ...
            </MenuButton>
            <MenuList backgroundColor="rgba(0, 0, 0, 0.7)" color="white" borderRadius="8px" padding="4px">
              <MenuItem value="edit" onClick={enterEditMode}  background="transparent">Edit</MenuItem>
              <MenuItem value="delete" onClick={onCancel} background="transparent">Delete</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
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
                {dateToString(classData.date)}
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
              {timeToString(classData.startTime)} - {timeToString(classData.endTime)}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
