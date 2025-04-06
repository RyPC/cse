import { useEffect, useState } from "react";

import {
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
} from "@chakra-ui/react";

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
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Select Class
          <ProgressBar currStep={1} />
        </ModalHeader>
        <ModalCloseButton />
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
      </ModalContent>
    </Modal>
  );
};
