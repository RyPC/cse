import { useEffect, useState } from "react";
import PublishedReviews from "../reviews/classreview";

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
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  return (
    <Box>
      test
      <PublishedReviews starRating={5}/>
    </Box>
  )
}