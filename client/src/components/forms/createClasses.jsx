import { useState } from "react";

import {
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  Center,
  Heading,
  VStack
} from "@chakra-ui/react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import axios from "axios";

import SaveClassAsDraftModal from "./modals/saveClassAsDraft";

export const CreateClassForm = () => {
  const sendAjax = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3001/classes/", {
        location,
        date,
        description,
        level,
        capacity,
        costume: performances,
        isDraft: false,
        title,
      })
      .then((response) => console.log(response))
      .catch((error) => console.log(error));

    setIsSubmitted(true);
  };

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("beginner");
  const [performances, setPerformances] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <Container>
      <Text
        fontSize="2xl"
        textAlign="center"
        mb={4}
      >
        New Class
      </Text>
      {!isSubmitted ? (
        <form onSubmit={sendAjax}>
          <FormControl>
            <FormLabel>Class Title</FormLabel>
            <Input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Capacity</FormLabel>
            <NumberInput min={0}>
              <NumberInputField
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </NumberInput>
          </FormControl>

          <FormControl>
            <FormLabel>Level</FormLabel>
            <Select
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Performances</FormLabel>
            <Input
              type="text"
              required
              value={performances}
              onChange={(e) => setPerformances(e.target.value)}
            />
          </FormControl>

          <Stack
            direction="row"
            justifyContent="center"
            mt={4}
          >
            <Button onClick={onOpen}>Save as Draft</Button>
            <Button
              colorScheme="blue"
              type="submit"
            >
              Publish
            </Button>
          </Stack>
        </form>
      ) : (
          <VStack>
            <IoIosCheckmarkCircle size={100} />
          
            <Heading as='h3' size='xl'>Class Submitted!</Heading> <br/>
              <Button colorScheme="blue">
                  Return to Classes Page
              </Button>
          </VStack>
      )}

      <SaveClassAsDraftModal
        isOpen={isOpen}
        onClose={onClose}
      />
    </Container>
  );
};

export default CreateClassForm;
