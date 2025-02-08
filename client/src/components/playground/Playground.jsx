import { useState } from "react";

import {
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
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";

import axios from "axios";

import CreateClassForm from "../forms/createClasses";

export const Playground = () => {
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  return <CreateClassForm />;
};
