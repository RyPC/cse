import { useState } from "react";

import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { IoIosCheckmarkCircle } from "react-icons/io";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import SaveClassAsDraftModal from "./modals/saveClassAsDraft";
import SaveClass from "./modals/saveClass";

export const CreateClassForm = ({ closeModal, modalData, reloadCallback}) => {
  const { backend } = useBackendContext();

  const postClass = async () => {
    console.log({
      location: location ? location : "",
      date: date ? date : new Date(),
      description: description ? description : "",
      level: level ? level : "",
      capacity: capacity ? capacity : 0,
      costume: performances ? performances : "",
      isDraft,
      title: title ? title : "",
    });

    if (isDraft && modalData) {
        await backend.put("/classes/" + modalData.id, {
            location: location ? location : "",
            date: date ? date : new Date(),
            description: description ? description : "",
            level: level ? level : "",
            capacity: capacity ? capacity : 0,
            costume: performances ? performances : "",
            isDraft: true,
            title: title ? title : "",
          })
          .then((response) => console.log(response))
          .catch((error) => console.log(error));
    } else {
        await backend.post("/classes", {
            location: location ? location : "",
            date: date ? date : new Date(),
            description: description ? description : "",
            level: level ? level : "",
            capacity: capacity ? capacity : 0,
            costume: performances ? performances : "",
            isDraft,
            title: title ? title : "",
        })
        .then((response) => console.log(response))
        .catch((error) => console.log(error));
    }
    reloadCallback();
    setIsSubmitted(true);
    onConfirmationClose();
    onClose();
  };

  const [title, setTitle] = useState(modalData.title ?? '');
  const [location, setLocation] = useState(modalData.location ?? '');
  const [date, setDate] = useState(modalData.date ?? '');
  const [description, setDescription] = useState(modalData.description ?? '');
  const [capacity, setCapacity] = useState(modalData.capacity ?? '');
  const [level, setLevel] = useState(modalData.level ?? "beginner");
  const [performances, setPerformances] = useState(modalData.performances ?? '');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDraft, setIsDraft] = useState(modalData !== null);

  return (
    <Container>
      <Text
        fontSize="2xl"
        textAlign="center"
        mb={4}
      >
        {!isSubmitted
          ? "New Class"
          : `${title} ${isDraft ? "Draft" : "Published"}`}
      </Text>
      {!isSubmitted
        ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onConfirmationOpen();
            }}
          >
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
              <Button
                onClick={() => {
                  onOpen();
                  setIsDraft(true);
                }}
              >
                Save as Draft
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
              >
                Publish
              </Button>
            </Stack>
          </form>
        )
        : (
          <VStack>
            <IoIosCheckmarkCircle size={100} />
            <Heading
              as="h3"
              size="xl"
            >
              {isDraft ? "Draft" : "Class"} Submitted!
            </Heading>{" "}
            <br />
            <Button colorScheme="blue" onClick={closeModal}>
              Return to Classes Page
            </Button>
          </VStack>
        )}

      <SaveClassAsDraftModal
        isOpen={isOpen}
        onClose={onClose}
        postClass={postClass}
      />
      <SaveClass
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        postClass={postClass}
      />
    </Container>
  );
};

export default CreateClassForm;
