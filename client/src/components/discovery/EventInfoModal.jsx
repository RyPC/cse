import { useCallback, useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Image,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import CoReqWarningModal from "./CoReqWarningModal";
import SuccessSignupModal from "./SuccessSignupModal";

function EventInfoModal({
  isOpenProp,
  handleClose,
  title,
  location,
  description,
  level,
  date,
  id,
  capacity,
  costume,
  isCorequisiteSignUp,
}) {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const closeCoreqModal = () => setOpenCoreqModal(false);

  const cancelCoreqModal = () => {
    enrollInEvent();
  };

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [corequisites, setCorequisites] = useState([]);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

const fetchCorequirements = useCallback(async () => {
    const fetchEnrolledClass = async (coreq) => {
      try {
        const response = await backend.get(`/class-enrollments`);
        const user = await backend
          .get(`/users/${currentUser.uid}`)
          .then((res) => res.data[0]);
        const classes = response.data;
        const filteredClass = classes
          .filter((classes) => classes.studentId === user.id)
          .map((classes) => classes.classId);

        const updatedCorequisites = coreq.map((coreq) => {
          if (filteredClass.includes(coreq.id)) {
            return { ...coreq, enrolled: true };
          }
          return coreq;
        });
        setCorequisites(updatedCorequisites);
      } catch (error) {
        console.error("Error fetching enrolled classes or users:", error);
      }
    };

    const response = await backend.get(`/classes/corequisites/${id}`);
    const coreq = response.data.map((coreq) => ({ ...coreq, enrolled: false }));
    setCorequisites(coreq);
    await fetchEnrolledClass(coreq);
  }, [backend, id, currentUser.uid]);

  const enrollInEvent = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/class-enrollments/`, {
        student_id: users.data[0].id,
        event_id: id,
        attendance: new Date(),
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const closeCoreq = async () => {
    closeCoreqModal();
    handleClose();
    await fetchCorequirements();
  };

  const eventSignUp = async () => {
    if (corequisites.some((coreq) => !coreq.enrolled)) {
      setOpenCoreqModal(true);
    } else {
      enrollInEvent();
    }
  };

  useEffect(() => {
    if (isOpenProp && !imageSrc) {
      fetch("https://dog.ceo/api/breeds/image/random") // for fun
        .then((res) => res.json())
        .then((data) => setImageSrc(data.message));
      fetchCorequirements();
    }
  }, [fetchCorequirements, imageSrc, isOpenProp]);


  if (!id) return null; //stops recursive loop
  return (
    <>
      <CoReqWarningModal
        origin="EVENT"
        isOpen={openCoreqModal}
        lstCorequisites={closeCoreq}
        handleClose={cancelCoreqModal}
      />

      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={() => setOpenCoreqModal(false)}
        isCoreq={isCorequisiteSignUp}
      />

      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              spacing={4}
              align="center"
            >
              <HStack width="100%">
                <Box>
                  <Text as="b">Corequisites</Text>
                  {corequisites.length === 0 ? (
                  <Text>No corequisites for this class</Text>
                  ) : (
                    <List>
                      {corequisites.map((coreq, index) => (
                        <ListItem key={index}>
                          <ListIcon
                            as={
                              coreq.enrolled
                                ? FaCircleCheck
                                : FaCircleExclamation
                            }
                          />
                          {coreq.title}
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Box>
              </HStack>
              <Box
                boxSize="sm"
                height="15rem"
                width={"100%"}
                alignContent={"center"}
                justifyContent={"center"}
                display="flex"
              >
                <Image
                  src={imageSrc}
                  alt="Random Dog"
                  width={"100%%"}
                />
              </Box>

              <HStack
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Location:</Text>
                  <Text>{location}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{date}</Text>
                </Box>
              </HStack>

              <Box width="100%">
                <Text fontWeight="bold">Description:</Text>
                <Text>{description}</Text>
              </Box>

              <HStack
                spacing={4}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Capacity:</Text>
                  <Text>{capacity}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Level:</Text>
                  <Text>{level}</Text>
                </Box>
              </HStack>

              <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold">Costume:</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="teal"
              onClick={eventSignUp}
            >
              Sign Up
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventInfoModal;
