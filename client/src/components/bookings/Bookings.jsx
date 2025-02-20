import { useState, useEffect } from "react";

import { ConfirmationModal } from "./ConfirmationModal";
import { ViewModal } from "./ViewModal";
import { CancelModal } from "./CancelModal";
import { EditModal } from "./EditModal";
import { Navbar } from "../navbar/Navbar";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { BsClock, BsGeoFill, BsPersonFill, BsChevronRight } from "react-icons/bs";
import { Button, Box, useDisclosure, Heading, Stack, VStack, Text, Icon, Spacer } from "@chakra-ui/react";

const stringToDate = (date) => {
  return new Date(date);
};

const stringToTime = (time) => {
  const [hours, minutes] = time.split(":");
  const d = new Date();
  d.setHours(hours, minutes, 0);

  return d;
};

const dateToString = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "numeric",
    day: "numeric"
  });
};

const timeToString = (time) => {
  return time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
};

export const Bookings = () => {
  const { backend } = useBackendContext();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("view");
  const [classData, setClassData] = useState({});  // data specific to class in current modal
  const [classes, setClasses] = useState([]);

  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
  };
  const onOpenModal = (data) => {
    console.log(data);
    setClassData(data);
    onOpen();
  };

  const handleClickEvents = () => {
    console.log("Booked events button has been pressed!");
  };
  const handleClickClasses = () => {
    console.log("Booked classes button has been pressed!");
  };
  const handleClickHistory = () => {
    console.log("Booked history button has been pressed!");
  };

  const fetchClassData = async () => {
    try {
      // Fetch scheduled classes
      const classesResponse = await backend.get('/scheduled-classes');

      // Fetch extra class data
      const classDataResponse = await backend.get('/classes');

      // Map class id to data
      const classDataDict = new Map();
      classDataResponse.data.forEach((cls) => classDataDict.set(cls.id, cls));

      // Update classes to have all info
      // Restructures data to be more readable
      const formattedData = classesResponse.data.map((cls) => ({
        classId: cls.classId,
        date: stringToDate(cls.date),
        startTime: stringToTime(cls.startTime),
        endTime: stringToTime(cls.endTime),
        title: classDataDict.get(cls.classId).title,
        description: classDataDict.get(cls.classId).description,
        location: classDataDict.get(cls.classId).location,
        capacity: classDataDict.get(cls.classId).capacity,
        level: classDataDict.get(cls.classId).level,
        costume: classDataDict.get(cls.classId).costume,
        isDraft: classDataDict.get(cls.classId).isDraft,
      }));

      setClasses(formattedData);
    } catch (error) {
      console.error('Error fetching class data:', error);
    }
  };
  
  useEffect(() => {
    // Fetch class data
    fetchClassData();
  }, []);

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Bookings</Heading>
        <div>
          <Button onClick={handleClickEvents}>Events</Button>
          <Button onClick={handleClickClasses}>Classes</Button>
          <Button onClick={handleClickHistory}>History</Button>
        </div>
        <Box
          p="16px"
          width="90vw"
          borderRadius="4px"
          backgroundColor="#D9D9D9"
          onClick={onOpen}
        >
          <Text fontWeight="bold" paddingBottom="8px" fontSize={18}> thing </Text>

          <Stack direction="row" align="center" fontSize={16}>
            <Icon as={BsClock} boxSize={4}/>
            <Text>Date and time</Text>
          </Stack>

          <Stack direction="row" align="center" fontSize={16}>
            <Icon as={BsGeoFill} boxSize={4}/>
            <Text> location </Text>
          </Stack>

          <Stack direction="row" align="center" fontSize={16}>
            <Icon as={BsPersonFill} boxSize={4}/>
            <Text> asdf </Text>
          </Stack>

          <Stack direction="row">
            <Spacer />
            <Button
              backgroundColor="#646363"
              color="white"
              // fontsi
            >
              View Details
              <Icon as={BsChevronRight}/>
            </Button>
          </Stack>

        </Box>
        {
          classes.map((cls) => (
            <Box
              p="16px"
              width="90vw"
              borderRadius="4px"
              backgroundColor="#D9D9D9"
              onClick={() => onOpenModal(cls)}
            >
              <Text fontWeight="bold" paddingBottom="8px" fontSize={18}> {cls.title} </Text>

              <Stack direction="row" align="center" fontSize={16}>
                <Icon as={BsClock} boxSize={4}/>
                <Text>
                  {dateToString(cls.date)} {timeToString(cls.startTime)} - {timeToString(cls.endTime)}
                </Text>
              </Stack>

              <Stack direction="row" align="center" fontSize={16}>
                <Icon as={BsGeoFill} boxSize={4}/>
                <Text> {cls.location} </Text>
              </Stack>

              <Stack direction="row" align="center" fontSize={16}>
                <Icon as={BsPersonFill} boxSize={4}/>
                <Text> {cls.capacity} </Text>
              </Stack>

              <Stack direction="row">
                <Spacer />
                <Button
                  backgroundColor="#646363"
                  color="white"
                >
                  View Details
                  <Icon as={BsChevronRight}/>
                </Button>
              </Stack>

            </Box>
          ))
        }
      </VStack>
      {
        currentModal === "view" ?
          <ViewModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} classData={classData}/> :
        (currentModal === "confirmation" ?
          <ConfirmationModal isOpen={isOpen} onClose={onCloseModal} /> :
          (currentModal === "edit" ?
            <EditModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} classData={classData} setClassData={setClassData} /> :
            
            <CancelModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} classData={classData} />
        )
      )
      }
      <Navbar></Navbar>
    </Box>

  );
};

