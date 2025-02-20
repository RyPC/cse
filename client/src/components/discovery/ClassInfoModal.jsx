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

import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import CoReqWarningModal from "./CoReqWarningModal";
import SuccessSignupModal from "./SuccessSignupModal";

function ClassInfoModal({
  isOpenProp,
  handleClose,
  title,
  description,
  location,
  capacity,
  level,
  costume,
  id,
  date,
  isCorequisiteSignUp,
}) {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();

  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const closeCoreqModal = () => setOpenCoreqModal(false);

  const cancelCoreqModal = () => {
    enrollInClass();
  };

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [corequisites, setCorequisites] = useState([]);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

  const fetchCorequirements = useCallback(async () => {
    const fetchEnrolledEvents = async (coreq) => {
      try {
        const response = await backend.get(`/event-enrollments`);
        const user = await backend
          .get(`/users/${currentUser.uid}`)
          .then((res) => res.data[0]);
        const events = response.data;
        const filteredEvents = events
          .filter((event) => event.studentId === user.id)
          .map((event) => event.eventId);

        const updatedCorequisites = coreq.map((coreq) => {
          if (filteredEvents.includes(coreq.id)) {
            return { ...coreq, enrolled: true };
          }
          return coreq;
        });
        setCorequisites(updatedCorequisites);
      } catch (error) {
        console.error("Error fetching enrolled events or users:", error);
      }
    };

    const response = await backend.get(`/classes/corequisites/${id}`);
    const coreq = response.data.map((coreq) => ({ ...coreq, enrolled: false }));
    setCorequisites(coreq);
    await fetchEnrolledEvents(coreq);
  }, [backend, id, currentUser.uid]);

  const enrollInClass = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/class-enrollments`, {
        studentId: users.data[0].id,
        classId: id,
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

  const classSignUp = async () => {
    if (corequisites.some((coreq) => !coreq.enrolled)) {
      setOpenCoreqModal(true);
    } else {
      enrollInClass();
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

  if (!id) return null;
  return (
    <>
      <CoReqWarningModal
        origin="CLASS"
        isOpenProp={openCoreqModal}
        lstCorequisites={corequisites}
        handleClose={closeCoreq}
        handleCancel={cancelCoreqModal}
      />

      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={() => setOpenCoreqModal(false)}
        isCoreq={isCorequisiteSignUp}
      />

      <Modal
        isOpen={isOpenProp}
        onClose={handleClose}
        size="full"
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
                  height={"100%"}
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
            <Button onClick={classSignUp}>Sign up</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ClassInfoModal;
