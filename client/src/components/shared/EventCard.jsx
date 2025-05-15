import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
  CardFooter,
  useDisclosure
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";


import { formatDate, formatTime } from "../../utils/formatDateTime";
import SignUpController from "../discovery/SignUpController";
import TeacherEventViewModal from "../bookings/teacherView/TeacherEventViewModal";
import { useState } from "react";

export const EventCard = ({
  id,
  title,
  location,
  description,
  level,
  date,
  startTime,
  endTime,
  callTime,
  classId,
  costume,
  capacity,
  attendeeCount = 0, // Default to 0 if not provided
  onClick,
  isAttended = false,
  triggerRefresh,
  onCloseModal,
  user = null,

}) => {
  const formattedDate = formatDate(date);
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  const [openModal, setOpenModal] = useState(false);
  const { pathname } = useLocation();
  const [openRootModal, setOpenRootModal] = useState(false);
  const [openTeacherModal, setOpenTeacherModal] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModal, setCurrentModal] = useState("view");
  const { role } = useAuthContext();

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  // const onCloseModal = () => {
  //   setCurrentModal("view");
  //   onClose();
  // };

  const closeTeacherModal = () => {
    setOpenTeacherModal(false);
    // onCloseModal();
  };

  const handleClickModal = () => {
      if (pathname === "/bookings" && role !== "student") {
        if (currentModal === "view") {
          setOpenTeacherModal(true);
          console.log("Open teacher view modal!");
        }
      } else if (pathname === "/bookings") {
        onClick();
      }
      else {
        setOpenRootModal(true);
      }
    };


  // console.log(user);
  return (
    <>
    <Box 
      display="flex"
      justifyContent="center"
      w={{ base: "100%", md: "30em" }}
      onClick={handleClickModal} 
      cursor="pointer">
      <Card
        w={{ base: "90%", md: "30em" }}
        border = "1px"
        borderColor="gray.300"
        bg="gray.50"
      >
        <CardHeader pb={0}>
          <HStack
            position="absolute"
            height = "15%"
            top="10%"
            right="5%"
            bg="purple.50"
            px={3}
            py={1}
            borderRadius="full"
            border="1px"
            borderColor="purple.600"
            color="black"
            fontSize="sm"
          >
            <Text>
              {attendeeCount} {parseInt(attendeeCount) === 1 ? "Person" : "People"} Enrolled
            </Text>
          </HStack>
        </CardHeader>
        <CardBody>
          <Box
            display="flex"
            justifyContent="start"> 
          <VStack
            alignItems="self-start"
            spacing={2}
          >
            <Text
            fontSize="1.5rem"
            fontWeight="bold"
          >
            {title}
          </Text>

            <HStack>
              <Text fontSize="sm">{location ? `${location}` : "No location"}</Text>
            </HStack>
            <HStack>
              <Text fontSize="sm">
                  {formattedDate
                    ? `${formattedDate} · ${formattedStartTime} - ${formattedEndTime}`
                    : "No date"}
              </Text>
            </HStack>


          </VStack>
          </Box>
        </CardBody>

        <CardFooter justifyContent="right" hidden>
            {/* <Text>Required Class ID: {classId}</Text> */}
            <SignUpController
              event_id={id}
              title={title}
              description={description}
              location={location}
              capacity={"might remove for events"}
              level={level}
              costume={costume}
              date={date}
              setOpenRootModal={setOpenRootModal}
              openRootModal={openRootModal}
              user={user}
            />
            <TeacherEventViewModal
              isOpenProp={openTeacherModal}
              handleClose={closeTeacherModal}
              id = {id}
              location = {location}
              title = {title}
              description = {description}
              level = {level}
              date = {date}
              startTime = {startTime}
              endTime = {endTime}
              callTime = {callTime}
              costume = {costume}
              capacity = {capacity}
              triggerRefresh = {triggerRefresh}
            />
        </CardFooter>
      </Card>
    </Box>
    </>
  );
};
