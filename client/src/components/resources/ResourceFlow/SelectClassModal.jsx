import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from "@chakra-ui/react";

import { AiOutlineArrowLeft } from "react-icons/ai";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { ProgressBar } from "./ProgressBar";

export const SelectClassModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  setClsId,
}) => {
  const [classes, setClasses] = useState([]);
  const [originalClasses, setOriginalClasses] = useState([]);
  const { backend } = useBackendContext();
  const [classId, setClassId] = useState("");
  const [query, setQuery] = useState("");

  const displayClasses = (query) => {
    return classes.filter((obj) => obj.name.includes(query));
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await backend.get("/classes");

        const formattedClasses = response.data.map((cls) => ({
          id: cls.id,
          name: cls.title, // Using title for dropdown display
          rsvp: 0,
          location: cls.location,
        }));
        const classEnrollmentResp = await backend.get("/class-enrollments");
        const classEnrollmentRespData = classEnrollmentResp.data;

        for (let i = 0; i < classEnrollmentRespData.length; i++) {
          const classEnrollment = classEnrollmentRespData[i];
          //  console.log(classEnrollment)
          for (let j = 0; j < formattedClasses.length; j++) {
            if (formattedClasses[j].id === classEnrollment.classId) {
              formattedClasses[j].rsvp++;
            }
          }
        }

        // setClassesObject(temp)
        // console.log(classesObject)

        setClasses(formattedClasses);
        setOriginalClasses(formattedClasses);
        // console.log(formattedClasses);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    fetchClasses();
  }, [backend]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader p={4}>
          <Flex
            align="center"
            position="relative"
            justify="center"
          >
            <IconButton
              aria-label="Back"
              variant="ghost"
              icon={<AiOutlineArrowLeft />}
              position="absolute"
              left={0}
              onClick={onClose}
            />
            <Text fontSize="xl">Select a class</Text>
          </Flex>
          <ProgressBar currStep={1} />
        </ModalHeader>
        <ModalBody>
          <Input
            placeholder="Search for a class..."
            onChange={(e) =>
              setClasses(
                originalClasses.filter((obj) =>
                  obj.name.includes(e.target.value)
                )
              )
            }
          />
          {classes.length > 0 ? (
            classes.map((cls, index) => (
              <Card
                key={index}
                onClick={() => {
                  setClsId(cls.id);
                  setCurrentModal("form");
                }}
              >
                <CardBody>
                  <b>{cls.name}</b> <br />
                  Location: {cls.location} <br />
                  RSVP: {cls.rsvp} people RSVP'd
                </CardBody>
              </Card>
            ))
          ) : (
            <option disabled>No classes available</option>
          )}
        </ModalBody>
        <ModalFooter
          position="fixed"
          bottom={0}
          left={0}
          right={0}
          bg="white"
          borderTop="1px solid"
          borderColor="gray.200"
          p={4}
          display="flex"
          justifyContent="center"
        >
          <Button
            colorScheme="purple"
            w="50%"
            onClick={{}}
          >
            Next
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
