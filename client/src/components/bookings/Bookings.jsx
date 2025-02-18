import { useEffect, useMemo, useState } from "react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { CreateClassForm } from "../forms/CreateClasses";
import { ConfirmationModal } from "./ConfirmationModal";
import { ViewModal } from "./ViewModal";
import { CancelModal } from "./CancelModal";
import { Navbar } from "../navbar/Navbar";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { redirect } from "react-router-dom";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentModal, setCurrentModal] = useState("view");
  const { userRole } = useRoleContext();
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const [id, setId] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [classes, setClasses] = useState([]);
  const [displayedClasses, setDisplayedClasses] = useState([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [selectedButton, setSelectedButton] = useState("classes");

  useMemo(() => {
    if (currentUser?.uid && backend) {
      backend
        .get(`/users/${currentUser.uid}`)
        .then((response) => {
          setId(response.data[0].id);
        });
    }
  }, [backend, currentUser?.uid]);

  const isStudent = userRole === "student";

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.uid && backend) {
        try {
          const userResponse = await backend.get(`/users/${currentUser.uid}`);
          const userId = userResponse.data[0].id;
          setId(userId);
          let classesResponse;
          if (isStudent) {
            classesResponse = await backend.get(`/students/joined/${userId}`);
          } else {
            classesResponse = await backend.get(`/classes`);
          }
          console.log(classesResponse.data);
          const tempClass = [];
          for (const value of Object.values(classesResponse.data)) {
            if (!value["isDraft"]) {
              tempClass.push(value);
            }
          }
          setClasses(classesResponse.data);
          setDisplayedClasses(tempClass);
          const allClasses = await backend.get("/classes");
          const tempDrafts = Object.values(allClasses.data).filter(
            (value) => value["isDraft"],
          );
          setDrafts(tempDrafts);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [backend, currentUser?.uid, isStudent]);

  const handleClickEvents = async () => {
    setSelectedButton("events");
    try {
      const events = await backend.get("/events");
      setDisplayedClasses(events.data);
      setShowDrafts(false);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
  const handleClickClasses = async () => {
    setSelectedButton("classes");
    try {
      let classesResponse;
      if (isStudent) {
        classesResponse = await backend.get(`/students/joined/${id}`);
      } else {
        classesResponse = await backend.get(`/classes`);
      }
      const tempDrafts = [];
      for (const value of Object.values(classesResponse.data)) {
        if (!value["isDraft"]) {
          tempDrafts.push(value);
        }
      }
      setDisplayedClasses(tempDrafts);
      setShowDrafts(false);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const handleClickDrafts = () => {
    setSelectedButton("drafts");
    setDisplayedClasses(drafts);
    setShowDrafts(true);
  };

  return (
    <Box height="100vh" position="relative">
      <VStack
        spacing={8}
        width="100%"
        height="calc(50vh - 60px)"
        marginX="auto"
        padding={5}
        alignItems="center"
        direction={"column"}
        justifyContent="flex-start"
      >
        <Heading size="lg" textAlign="center" mb={4}>
          Bookings
        </Heading>
        <HStack spacing={4}>
          <Button
            size="sm"
            onClick={handleClickEvents}
            bg={selectedButton === "events" ? "gray.500" : "blue.500"}
            color="white"
            _hover={{ bg: "blue.700" }}
          >
            Events
          </Button>
          <Button
            size="sm"
            onClick={handleClickClasses}
            bg={selectedButton === "classes" ? "gray.500" : "blue.500"}
            color="white"
            _hover={{ bg: "blue.700" }}
          >
            Classes
          </Button>
          {!isStudent && (
            <Button
              size="sm"
              onClick={handleClickDrafts}
              bg={selectedButton === "drafts" ? "gray.500" : "blue.500"}
              color="white"
              _hover={{ bg: "blue.700" }}
            >
              Drafts
            </Button>
          )}
        </HStack>
        <Box
          display="flex"
          flexWrap="wrap"
          flexDir={"column"}
          justifyContent="center"
          alignItems="center"
          gap={4}
          width="100%"
        >
          {displayedClasses.map((item) => (
            <ClassCard
              key={item.id}
              title={item.title}
              time="Placeholder Time"
              location={item.location}
            />
          ))}
        </Box>
        {!isStudent && <AddButton onOpen={onOpen} />}
      </VStack>
      {currentModal === "view"
        ? (
          <ViewModal
            isOpen={isOpen}
            onClose={onClose}
            setCurrentModal={setCurrentModal}
          >
            <CreateClassForm />
          </ViewModal>
        )
        : currentModal === "confirmation"
        ? <ConfirmationModal isOpen={isOpen} onClose={onClose} />
        : (
          <CancelModal
            isOpen={isOpen}
            onClose={onClose}
            setCurrentModal={setCurrentModal}
          />
        )}
      <Navbar />
    </Box>
  );
};

const ClassCard = ({ title, time, location, rsvpCount, link }) => {
  return (
    <Card width="300px" minHeight="100px" position="relative">
      <CardHeader paddingBottom={1}>
        <Heading size={"lg"}>{title ? title : "Placeholder Title"}</Heading>
      </CardHeader>
      <CardBody paddingTop={1}>
        <Text>Time: {time ? time : "1/27/2025 @ 1 PM - 3 PM"}</Text>
        <Text>Location: {location ? location : "Irvine"}</Text>
        <Text>RSVPd: {rsvpCount ? rsvpCount : 10}</Text>
      </CardBody>
      <Button
        size="sm"
        colorScheme="blue"
        position="absolute"
        bottom="8px"
        right="8px"
        onClick={() => redirect(link ? link : "#")}
      >
        View Details
      </Button>
    </Card>
  );
};

const AddButton = ({ onOpen }) => {
  return (
    <Button
      onClick={onOpen}
      position="fixed"
      bottom="160px"
      right="50px"
      borderRadius="50%"
      width="60px"
      height="60px"
      bg="blue.500"
      color="white"
      _hover={{ bg: "blue.700" }}
      fontSize="2xl"
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 5V19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M5 12H19"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </Button>
  );
};
