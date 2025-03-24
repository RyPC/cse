import { useState, useRef } from "react";

import { Button, Flex, Input, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter,
  Select, Text, IconButton, FormControl, FormLabel, Textarea } from "@chakra-ui/react";

import { BsChevronLeft } from "react-icons/bs";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";


const stringToDate = (dateString) => {
  // Split string and convert to numbers
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const stringToTime = (timeString) => {
  const d = new Date();
  // Split time and AM/PM
  const [time, modifier] = timeString.split(" ");
  const [hours, minutes] = time.split(":");

  // Convert to 24-hour time
  let hoursIn24 = parseInt(hours, 10);
  if (modifier === "PM" && hoursIn24 !== 12) {
    hoursIn24+= 12;
  }
  else if (modifier === "AM" && hoursIn24 === 12) {
    hoursIn24 = 0;
  }

  d.setHours(hoursIn24, parseInt(minutes, 10), 0);

  return d;
};

const formatDate = (date) => {
  if (!(date instanceof Date)) date = new Date(date); // Ensure it's a Date object
  return date.toISOString().split("T")[0]; // Extract YYYY-MM-DD
};

export const TeacherEditModal = ({ isOpen, onClose, setCurrentModal, classData, setClassData, performances, setRefresh }) => {
  const { backend } = useBackendContext();
  const [isPublishing, setIsPublishing] = useState(false);
  const formRef = useRef(null);

  const onBack = () => {
    setCurrentModal("view");
  };
  const onSave = async (draft) => {
    try {
      // PUT request to save class data
      const updatedData = {
        title: classTitle,
        description,
        location,
        capacity,
        level,
        costume: null,
        isDraft: draft,
      };
      await backend.put(`/classes/${classData.id}`, updatedData);
      console.log("Updating class", classData.id, updatedData);

      if (date)
        await backend.put(`/scheduled-classes/`,
            { 
                class_id: classData.id, 
                date: date, 
                start_time: startTime, 
                end_time: endTime 
            }
        );
      // Update classData
      setClassData((prev) => ({
        ...prev,
        date,
        startTime,
        endTime,
        title: classTitle,
        description,
        location,
        capacity,
        level,
        isDraft: draft,
      }));

      setCurrentModal("view");
      setRefresh();
    } catch (error) {
      console.error('Error updating class data:', error);
    }
  };
  const onSaveAsDraft = async () => {
    await onSave(true);
  };
  const onPublish = async () => {
    setIsPublishing(true);
    
    // defer validation for isPublishing to update
    setTimeout(() => {
      if (formRef.current && !formRef.current.checkValidity()) {
        formRef.current.reportValidity(); // stops user from submitting if date is empty
        return;
      }
  
      onSave(false); // publishes, swithes is_draft to false
    }, 0);
  };
  

  // input values
  const [classTitle, setClassTitle] = useState(classData?.title);
  const [location, setLocation] = useState(classData?.location);
  const [date, setDate] = useState(classData?.date ? formatDate(classData.date) : "");
  const [startTime, setStartTime] = useState(classData?.startTime);
  const [endTime, setEndTime] = useState(classData?.endTime);
  const [description, setDescription] = useState(classData?.description);
  const [capacity, setCapacity] = useState(classData?.capacity);
  const [level, setLevel] = useState(classData?.level);

  const handleLocationSelect = (e) => {
    setLocation(e.target.value);
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Flex align="center" w="100%" position="relative">
          <IconButton onClick={onBack} icon={<BsChevronLeft />} position="absolute" left={5} backgroundColor="white"/>
          <ModalHeader flex={1} textAlign="center">{classData.title}</ModalHeader>
        </Flex>
        <ModalBody>
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}> {/* necessary for required tag on date! */}
            <FormControl mb={4}>
              <FormLabel>Class Title</FormLabel>
              <Input
                  value={classTitle}
                  onChange={onTitleChange}
                  placeholder="Enter class title..."
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                  value={location}
                  onChange={handleLocationSelect}
                  placeholder="Enter location..."
              />
            </FormControl>

            <FormControl mb={4} isRequired={isPublishing}>
              <FormLabel>Date</FormLabel>
              <Input
                  type="date"
                  value={date}
                  onChange={onDateChange}
                  maxWidth="200px"
                  placeholder="Enter date..."
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Start Time</FormLabel>
              <Input
                  type="time"
                  maxWidth="200px"
                  value={startTime}
                  onChange={onStartTimeChange}
                  placeholder="Enter start time..."
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>End Time</FormLabel>
              <Input
                  type="time"
                  maxWidth="200px"
                  value={endTime}
                  onChange={onEndTimeChange}
                  placeholder="Enter end time..."
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea 
                  height="100px"
                  value={description}
                  onChange={onDescriptionChange}
                  placeholder="Enter description..."
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Capacity</FormLabel>
              <Input
                  type="number"
                  maxWidth="200px"
                  value={capacity}
                  onChange={onCapacityChange}
                  placeholder="Enter capacity..."
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Level</FormLabel>
              <Select
                  maxWidth="200px"
                  value={level}
                  placeholder="Select level..."
                  onChange={handleLevelSelect}
              >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
              </Select>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Performances</FormLabel>
              <Select
                  maxWidth="200px"
                  value={location}
                  onChange={handleLocationSelect}
              >
                  {performances.map((performance) => (
                  <option key={performance.id} value={performance.id}>
                      {performance.title}
                  </option>
                  ))}
              </Select>
            </FormControl>

          </form>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="100%">
            <Button backgroundColor="#D9D9D9" mr={3} onClick={onSaveAsDraft}>
              Save as Draft
            </Button>
            <Button backgroundColor="#646363" mr={3} onClick={onPublish}>
              Publish
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

