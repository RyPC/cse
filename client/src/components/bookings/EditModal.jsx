import { useState } from "react";

import { Button, Container, Flex, Input, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter,
  Select, Text } from "@chakra-ui/react";

export const EditModal = ({ isOpen, onClose, setCurrentModal, classData, setClassData }) => {
  const onCancel = () => {
    setCurrentModal("view");
  };
  const onSave = () => {
    setCurrentModal("view");
  }


  // input values
  const [classTitle, setClassTitle] = useState(classData.title);
  const [location, setLocation] = useState(classData.location);
  const [date, setDate] = useState(classData.date.toLocaleDateString("en-CA"));
  const [startTime, setStartTime] = useState(classData.startTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
  const [endTime, setEndTime] = useState(classData.endTime.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
  const [description, setDescription] = useState(classData.description);
  const [capacity, setCapacity] = useState(classData.capacity);
  const [level, setLevel] = useState(classData.level);

  const handleLocationSelect = (e) => {
    setLocation(e.target.value)
  }

  const handleLevelSelect = (e) => {
    setLevel(e.target.value);
  }

  const onTitleChange = (e) => setClassTitle(e.target.value);
  const onDescriptionChange = (e) => setDescription(e.target.value);
  const onCapacityChange = (e) => setCapacity(e.target.value);
  const onDateChange = (e) => setDate(e.target.value);
  const onStartTimeChange = (e) => setStartTime(e.target.value);
  const onEndTimeChange = (e) => setEndTime(e.target.value);

  return (
    <div>
      {/* {data} */}
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
            onChange={onTitleChange}
            placeholder="Enter class title..."/>
            <Text mb='1rem'>
              Location
            </Text>
            <Select maxWidth="200px" value={location} placeholder='Select location...' onChange={handleLocationSelect}>
              <option value={classData.location}>{classData.location}</option>
              <option value="Location 1">Location 1</option>
              <option value="Location 2">Location 2</option>
            </Select>
            <Text mb='1rem'>
              Date
            </Text>
            <Input
            type="date"
            value={date}
            onChange={onDateChange}
            maxWidth="200px"
            placeholder="Enter date.."/>
            <Text mb='1rem'>
              Start Time
            </Text>
            <Input
            type="time"
            maxWidth="200px"
            value={startTime}
            onChange={onStartTimeChange}
            placeholder="Enter start time..."/>
            <Text mb='1rem'>
              End Time
            </Text>
            <Input
            type="time"
            maxWidth="200px"
            value={endTime}
            onChange={onEndTimeChange}
            placeholder="Enter end time..."/>
            <Text mb='1rem'>
              Description
            </Text>
            <Input
            height="100px"
            value={description}
            onChange={onDescriptionChange}
            placeholder="Enter description..."/>
            <Text mb='1rem'>
              Capacity
            </Text>
            <Input
            type="number"
            maxWidth="200px"
            value={capacity}
            onChange={onCapacityChange}
            placeholder="Enter time..."/>
            <Text mb='1rem'>
              Level
            </Text>
            <Select maxWidth="200px" value={level} placeholder='Select level...' onChange={handleLevelSelect}>
              <option value='beginner'>1</option>
              <option value='intermediate'>2</option>
              <option value='advanced'>3</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onCancel}>
              Cancel
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

