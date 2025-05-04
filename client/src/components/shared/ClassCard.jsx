import { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardBody,
  CardFooter,
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
import SignUpController from "../discovery/SignUpController";

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
  user = null
}) => {
  const formattedDate = date ? formatDate(date) : null;
  const formattedStartTime = startTime ? formatTime(startTime) : null;
  const formattedEndTime = endTime ? formatTime(endTime) : null;
  const { backend } = useBackendContext();
  const [classDate, setClassDate] = useState(null);
  const { pathname } = useLocation();
  const [openRootModal, setOpenRootModal] = useState(false);
  // console.log({formattedDate, formattedStartTime, formattedEndTime})
  // const fetchClassDate = async () => {
  //   if (!classDate) {
  //     // console.log("id", id);
  //     const response = await backend.get(`/scheduled-classes/${id}`);
  //     if (response?.data[0]?.date) {
  //       const formattedDate = new Date(
  //         response.data[0].date
  //       ).toLocaleDateString("en-US");
  //       setClassDate(formattedDate);
  //     }
  //   }
  // };
  useEffect(() => {
    const fetchClassDate = async () => {
      if (!classDate && id) {
        // console.log("id", id);
        const response = await backend.get(`/scheduled-classes/${id}`);
        if (response?.data[0]?.date) {
          const newDate = new Date(
            response.data[0].date
          ).toLocaleDateString("en-US");
          setClassDate(newDate);
        }
      }
    };
    fetchClassDate();
  }, [backend, classDate, id]);

  return (
    <>
    <Box onClick={() => {
                if (pathname === "/bookings") {
                  onClick();
                } else {
                  setOpenRootModal(true);
                }
              }} 
          cursor="pointer">
      <Card
        w={{ base: "90%", md: "30em" }}
        border = "1px"
        borderColor="gray.300"
        bg="gray.50"
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
                {attendeeCount} {attendeeCount === 1 ? "Person" : "People"} Enrolled
              </Text>
            </HStack>
            
            <HStack>
              <FaClock size={14} />
              <Text fontSize="sm">
                {formattedDate
                  ? `${formattedDate} @ ${formattedStartTime} - ${formattedEndTime}`
                  : "No date"}
              </Text>
            </HStack>

            <HStack>
              <FaMapMarkerAlt size={14} />
              <Text fontSize="sm">{location}</Text>
            </HStack>
          </VStack>
        </CardBody>

        <CardFooter
          justifyContent="right"
          hidden
        >
          {/* <Text>0/{capacity} spots left</Text> */}
          <SignUpController
            class_id={id}
            title={title}
            description={description}
            location={location}
            capacity={capacity}
            level={level}
            costume={costume}
            date={classDate}
            setOpenRootModal={setOpenRootModal}
            openRootModal={openRootModal}
            user={user}
          />
        </CardFooter>
      </Card>
      </Box>
    </>
  );
};
