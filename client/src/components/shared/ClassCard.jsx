import { useEffect, useState } from "react";

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

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import ClassInfoModal from "../discovery/ClassInfoModal";

export const ClassCard = ({
  title,
  description,
  location,
  capacity,
  level,
  costume,
  date,
  startTime,
  endTime,
  attendeeCount = 0, // Default to 0 if not provided
  onClick,
  id,
}) => {
  const formattedDate = date ? formatDate(date) : null;
  const formattedStartTime = startTime ? formatTime(startTime) : null;
  const formattedEndTime = endTime ? formatTime(endTime) : null;
  const { backend } = useBackendContext();
  const [openModal, setOpenModal] = useState(false);
  const [classDate, setClassDate] = useState(null);
  const { pathname } = useLocation();

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleCancel = () => {
    setOpenModal(false);
  };
  const fetchClassDate = async () => {
    if (!classDate) {
      console.log("id", id)
      const response = await backend.get(`/scheduled-classes/${id}`);
      if (response?.data[0]?.date) {
        console.log(response.data[0].date);
        const formattedDate = new Date(
          response.data[0].date
        ).toLocaleDateString("en-US");
        console.log(formattedDate);
        setClassDate(formattedDate);
      }
    }
  };
  useEffect(() => {
    fetchClassDate();
  }, [backend, classDate, id]);

  return (
    <>
      <ClassInfoModal
        isOpenProp={openModal}
        title={title}
        description={description}
        location={location}
        capacity={capacity}
        level={level}
        costume={costume}
        id={id}
        date={classDate}
        isCorequisiteSignUp={false}
        handleClose={handleOpenModal}
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
