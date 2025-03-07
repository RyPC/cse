import { useEffect, useState } from "react";
import PublishedReviews from "../reviews/classReview";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { ClassRSVP } from "../rsvp/classRsvp";
import { EventRSVP } from "../rsvp/eventRsvp";
import axios from "axios";

// import QRCodeReact from "react-qr-code";


import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import CreateClassForm from "../forms/createClasses";

export const Playground = () => {
  const { currentUser } = useAuthContext();

  useEffect(() => {
    if (currentUser?.id) {
      localStorage.setItem("userId", currentUser.id);
    }
  }, [currentUser]);

  // Generate the check-in URLs
  const classId = "25";
  const eventId = "28";
  const classCheckInUrl = `${window.location.origin}/check-in/class/${classId}`;
  const eventCheckInUrl = `${window.location.origin}/check-in/event/${eventId}`;
  console.log("classCheckInUrl", classCheckInUrl);
  console.log("eventCheckInUrl", eventCheckInUrl);

  const sendAjax = (e) => {
    axios
      .post("http://localhost:3001/classes/", {
        location: location,
        date: date,
        description: description,
        level: level,
        capacity: capacity,
        costume: performances, // Need to confirm the equivalence between the two fields here
        isDraft: false,
        title: title,
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    setIsSubmitted(true);
  };

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [performances, setPerformances] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const flag = true;

  return (
    <Box>
      {/* test
      <PublishedReviews starRating={5}/> */}
      <Button 
        onClick={onOpen} 
        variant="unstyled"
        fontSize="lg" 
        fontWeight="normal"
        color="black"
        textDecoration="underline"
        _focus={{ boxShadow: "none" }}
      >
        View attendees &gt;
      </Button>

      { flag ? 
        <ClassRSVP
        isOpen={isOpen}
        onClose={onClose}
        card={{name: "Dance 101", id: 4}}
        />
      :
        <EventRSVP
          isOpen={isOpen}
          onClose={onClose}
          card={{name: "VIBE Dance Competition", id: 3}}
        />
      }
      
      
    </Box>
  )
}