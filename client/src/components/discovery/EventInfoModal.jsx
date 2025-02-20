import { useState } from "react";

import {
  Box,
  Button,
  HStack,
  Image,
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
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [imageSrc, setImageSrc] = useState("");
  const [openCoreqModal, setOpenCoreqModal] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const enrollInEvent = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/event-enrollments/`, {
        student_id: users.data[0].id,
        event_id: id,
        attendance: new Date(),
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const onClose = () => {
    if (isCorequisiteSignUp) {
      handleClose();
      setOpenSuccessModal(false);
    }
    handleClose();
  };

  const eventSignUp = async () => {
    enrollInEvent();
  };

  if (!id) return null; //stops recursive loop
  return (
    <>
      <CoReqWarningModal
        origin="EVENT"
        isOpen={openCoreqModal}
        lstCorequisites={[]}
        handleClose={() => setOpenCoreqModal(false)}
      />

      <SuccessSignupModal
        isOpen={openSuccessModal}
        isCoreq={isCorequisiteSignUp}
        title={title}
        onClose={onClose}
      />

      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={onClose}
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
                <Text>
                  <Box as="b">Corequisites</Box>
                  {/* {corequisites.length === 0 ? (
                    "No corequisites for this class"
                  ) : (
                    <List>
                      {corequisites.map((coreq) => (
                        <ListItem key={coreq.id}>{coreq.title}</ListItem>
                      ))}
                    </List>
                  )} */}
                </Text>
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
