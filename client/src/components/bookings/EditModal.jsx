import { useState } from "react";

import { Button, Container, Flex, Input, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter,
  Select, Text } from "@chakra-ui/react";

export const EditModal = ({ isOpen, onClose, setCurrentModal, classData, setClassData }) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };

  // input values
  const [classTitle, setClassTitle] = useState(classData.data.title);
  const [location, setLocation] = useState(classData.data.location);
  const [date, setDate] = useState(classData.date);
  const [startTime, setStartTime] = useState(classData.startTime);
  const [endTime, setEndTime] = useState(classData.endTime);
  const [description, setDescription] = useState(classData.data.description);
  const [capacity, setCapacity] = useState(classData.data.capacity);
  const [level, setLevel] = useState(classData.data.level);

  const handleLocationSelect = (e) => {
    setLocation(e.target.value)
  }

  const handleLevelSelect = (e) => {
    setLevel(e.target.value);
  }

  const handleSubmit = () => {
    setClassTitle(classTitle);
    setDate(date);
    setStartTime(startTime);
    setEndTime(endTime);
    setDescription(description);
    setCapacity(capacity);


    data = [classTitle, date, startTime, endTime, description, capacity];
    setClassData(data);
  }

  return (
    <div>
      {data}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Flex>
            <Container centerContent>
              <ModalHeader>Edit Mode</ModalHeader>
              <Button onClick={onCancel}>
                ...
              </Button>
            </Container>
          </Flex>
          <ModalCloseButton />
          <ModalBody>
            <Text mb='1rem'>
              Class Title
            </Text>
            <Input
            value={classTitle}
            placeholder="Enter class title..."/>
            <Text mb='1rem'>
              Location
            </Text>
            <Select maxWidth="200px" value={location} placeholder='Select location...' onChange={handleLocationSelect}>
              <option value="Walnut">Walnut</option>
              <option value="Location 1">Location 1</option>
              <option value="Location 2">Location 2</option>
            </Select>
            <Text mb='1rem'>
              Date
            </Text>
            <Input
            type="date"
            maxWidth="200px"
            placeholder="Enter date.."/>
            <Text mb='1rem'>
              Start Time
            </Text>
            <Input
            type="time"
            maxWidth="200px"
            value={startTime}
            placeholder="Enter start time..."/>
            <Text mb='1rem'>
              End Time
            </Text>
            <Input
            type="time"
            maxWidth="200px"
            value={endTime}
            placeholder="Enter end time..."/>
            <Text mb='1rem'>
              Description
            </Text>
            <Input
            height="100px"
            value={description}
            placeholder="Enter description..."/>
            <Text mb='1rem'>
              Capacity
            </Text>
            <Input
            type="number"
            maxWidth="200px"
            value={capacity}
            placeholder="Enter time..."/>
            <Text mb='1rem'>
              Level
            </Text>
            <Select maxWidth="200px" value={level} placeholder='Select level...' onChange={handleLevelSelect}>
              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onCancel}>
              Cancel
            </Button>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

