import { useEffect, useState } from "react";

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
  VStack,
} from "@chakra-ui/react";

import axios from "axios";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ClassCard } from "../shared/ClassCard";
import { EventCard } from "../shared/EventCard";

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
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);

  const { backend } = useBackendContext();
  useEffect(() => {
    const fetchData = async () => {
      // Fetch and Store Classes Information
      try {
        const response = await backend.get("/classes");
        setClasses([response.data[0]]);
        // setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
      try {
        const response = await backend.get("/events");
        setEvents([response.data[0]]);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchData();
  }, [backend]);

  return (
    <>
      <VStack>
        {" "}
        {classes.map((classItem, index) => (
          <ClassCard
            id={classItem.id}
            key={index}
            title={classItem.title}
            description={classItem.description}
            location={classItem.location}
            capacity={classItem.capacity}
            level={classItem.level}
            costume={classItem.costume}
          />
        ))}
      </VStack>
      <VStack>
        {events.map((eventItem, index) => (
          <EventCard
            key={index}
            title={eventItem.title}
            location={eventItem.location}
            description={eventItem.description}
            level={eventItem.level}
            date={eventItem.date}
            startTime={eventItem.startTime}
            endTime={eventItem.endTime}
            callTime={eventItem.callTime}
            classId={eventItem.classId}
            costume={eventItem.costume}
            id={eventItem.id}
          />
        ))}
      </VStack>
    </>
  );
};
