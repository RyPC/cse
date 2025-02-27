import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
  Button,
  CardFooter,
  useDisclosure
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

import { formatDate, formatTime } from "../../utils/formatDateTime";
import SignUpController from "../discovery/SignUpController";
import TeacherEventViewModal from "../discovery/TeacherEventViewModal";
import { useState } from "react";

export const EventCard = ({
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
  attendeeCount = 0, // Default to 0 if not provided
  onClick,
  id,
}) => {
  const formattedDate = formatDate(date);
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  const [openModal, setOpenModal] = useState(false);
  const { pathname } = useLocation();
  const [openRootModal, setOpenRootModal] = useState(false);
  const [openTeacherModal, setOpenTeacherModal] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCard, setSelectedCard] = useState();
  const [coEvents, setCoEvents] = useState([]);
  const [currentModal, setCurrentModal] = useState("view");
  const { currentUser, role } = useAuthContext();

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };

  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
  };

  const closeTeacherModal = () => {
    setOpenTeacherModal(false);
    onClose();
  };


  return (
    <>
       <Card
      w={{ base: "90%", md: "30em" }}
      bg="gray.200"
    >
      <CardHeader pb={0}>
        <Heading
          size="md"
          fontWeight="bold"
        >
          {title}
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack
          align="stretch"
          spacing={2}
        >
          <HStack>
            <FaClock size={14} />
            <Text fontSize="sm">
              {formattedDate} @ {formattedStartTime} - {formattedEndTime}
            </Text>
          </HStack>

          <HStack>
            <FaMapMarkerAlt size={14} />
            <Text fontSize="sm">{location}</Text>
          </HStack>

          <HStack>
            <FaUser size={14} />
            <Text fontSize="sm">
              {attendeeCount} {attendeeCount === 1 ? "person" : "people"} RSVP'd
            </Text>
          </HStack>
          <Button
            alignSelf="flex-end"
            variant="solid"
            size="sm"
            bg="gray.500"
            color="black"
            _hover={{ bg: "gray.700" }}
            mt={2}
            onClick={() => {
              if (pathname === "/bookings") {
                onClick();
              } else if (role !== "student") {
                console.log("ur not a student, open teacher view modal!");
                setOpenTeacherModal(true);
              }
              else {
                setOpenRootModal(true);
              }
            }}
          >
            View Details &gt;
          </Button>
        </VStack>
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
          />
          <TeacherEventViewModal
            isOpenProp={openTeacherModal}
            handleClose={closeTeacherModal}
          />
        </CardFooter>
      </Card>
    </>
  );
};
