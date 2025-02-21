import { useState } from "react";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaClock, FaMapMarkerAlt, FaUser } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import { formatDate, formatTime } from "../../utils/formatDateTime";
import EventInfoModal from "../discovery/EventInfoModal";

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

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  return (
    <>
      <EventInfoModal
        isOpenProp={openModal}
        title={title}
        id={id}
        location={location}
        description={description}
        level={level}
        date={date}
        costume={costume}
        isCorequisiteSignUp={false}
        handleClose={() => setOpenModal(false)}
        handleCancel={handleCancel}
      />
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
                {attendeeCount} {attendeeCount === 1 ? "person" : "people"}{" "}
                RSVP'd
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
                } else {
                  handleOpenModal();
                }
              }}
            >
              View Details &gt;
            </Button>
          </VStack>
        </CardBody>
      </Card>
    </>
  );
};
