import { useEffect, useState } from "react";
import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md"
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  Flex,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  useToast,
} from "@chakra-ui/react";

import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useNavigate } from "react-router-dom";
import SuccessSignupModal from "./SuccessSignupModal";
import CreateEvent from "../forms/createEvent";

function EventInfoModal({
  isOpenProp,
  handleClose,
  title,
  location,
  time,
  description,
  level,
  date,
  id,
  capacity,
  rsvpnum,
  costume,
  isCorequisiteSignUp,
  corequisites,
  handleResolveCoreq = () => {},
}) {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const toast = useToast();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

  const [isEditing, setIsEditing] = useState(false);



  const enrollInEvent = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/event-enrollments/`, {
        student_id: users.data[0].id,
        event_id: id,
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const eventSignUp = async () => {
    if (isCorequisiteSignUp) {
      enrollInEvent();
      return;
    }

    if (corequisites.some((coreq) => !coreq.enrolled)) {
      handleResolveCoreq();
    } else {
      enrollInEvent();
    }
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };
  const handleDeleteEvent = async () => {
    try {
      const response = await backend.delete(`/events/${id}`);
      if (response.status === 200) {
        toast({
          title: "Event deleted",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        handleClose();
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Error deleting event",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (isOpenProp && !imageSrc) {
      fetch("https://dog.ceo/api/breeds/image/random") // for fun
        .then((res) => res.json())
        .then((data) => setImageSrc(data.message));
    }
  }, [imageSrc, isOpenProp]);

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={handleSuccess}
        isCoreq={isCorequisiteSignUp}
      />

      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
              <HStack justify="space-between">
                  <MdArrowBackIosNew onClick={handleClose}/>
                  <Heading size="lg">{title ? title : "N/A"}</Heading> {/* Will add from prop */}
                  <Menu>
                    <MenuButton as={IconButton} icon={<MdMoreHoriz />}/>
                    <MenuList>
                      <MenuItem onClick={console.log('editing')}>Edit</MenuItem>
                      <MenuItem onClick={handleDeleteEvent}>Delete</MenuItem>
                    </MenuList>
                  </Menu>
              </HStack>
          </ModalHeader>
          <ModalBody>
            <HStack padding={3}>
              <Box width="60%">
                <Text fontWeight="bold">Location:</Text>
                <Text>{location ? location : "N/A"}</Text>
              </Box>
              <Box width="40%" >
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{date ? date : "N/A"}</Text>
                </Box>
            </HStack>

            <VStack
              spacing={4}
              align="center"
            >
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

              <Box width="100%" align="center">
                <Text fontWeight="bold"> {rsvpnum ? rsvpnum : 0} RSVPs</Text>
                <Text> View attendees &gt;</Text>
              </Box>

              <Box width="100%">
                <Text fontWeight="bold">Time:</Text>
                <Text>{time ? time : "TBD"}</Text>
              </Box>

              <Box width="100%">
                <Text fontWeight="bold">Description:</Text>
                <Text>{description ? description: "TBD"}</Text>
              </Box>

              <HStack
                spacing={4}
                width={"100%"}
                justifyContent={"space-around"}
              >
                <Box width="50%">
                  <Text fontWeight="bold">Capacity:</Text>
                  <Text>{capacity ? capacity : 0}</Text>
                </Box>
                <Box width="50%">
                  <Text fontWeight="bold">Level:</Text>
                  <Text>{level ? level : "TBD"}</Text>
                </Box>
              </HStack>

              {/* <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold">Costume:</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack> */}
              <HStack width="100%">
                {!isCorequisiteSignUp && (
                  <Box>
                    <Text as="b">Class Corequisites</Text>
                    {!corequisites || corequisites.length === 0 ? (
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
                )}
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
