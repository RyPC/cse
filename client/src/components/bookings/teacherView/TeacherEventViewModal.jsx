import { useEffect, useState } from "react";
import { MdArrowBackIosNew, MdMoreHoriz, } from "react-icons/md"
import { BiSolidEdit } from "react-icons/bi";
import { FaRegTrashCan } from "react-icons/fa6";

import {
  Box,
  Button,
  Center,
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
  useDisclosure
} from "@chakra-ui/react";

import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { formFormatDate } from "../../../utils/formFormatDateTime";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useNavigate } from "react-router-dom";
import SuccessSignupModal from "../../discovery/SuccessSignupModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ConfirmationModal } from "../../discovery/ConfirmationModal";
import { CreateEvent } from "../../forms/createEvent";
import { calcLength } from "framer-motion";
import { BsChevronLeft } from "react-icons/bs";
import { createEmitAndSemanticDiagnosticsBuilderProgram } from "typescript";
import { EventRSVP } from "../../rsvp/eventRsvp";
import { QRCode } from "./qrcode/QRCode.jsx";

function TeacherEventViewModal({
  isOpenProp,
  handleClose,
  title,
  location,
  startTime,
  endTime,
  callTime, 
  description,
  level,
  date,
  id,
  capacity,
  rsvpnum,
  costume,
  isCorequisiteSignUp,
  corequisites,
  triggerRefresh,
  handleResolveCoreq = () => {},
}) {
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();
  const formattedDate = formatDate(date);
  const formattedStartTime = formatTime(startTime);
  const formattedEndTime = formatTime(endTime);
  const formattedCallTime = formatTime(callTime);
  const formFormattedDate = formFormatDate(date)
  const toast = useToast();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);


  // disclosure for rsvp
  const {isOpen, onOpen, onClose} = useDisclosure();


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
    setRefresh();
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    // console.log("Set isEditing to false");
  }
  
  const onBack = () => {
    setIsEditing(false);
  }

  const handleEditEvent = () => {
    setIsEditing(true);
    // console.log("clicked edit");
  };

  const handleDeleteEvent = () => {
    setIsDeleting(true);
  }

  const onConfirmDelete = async () => {
    try {
      const response = await backend.delete(`/events/${id}`);
      if (response.status === 200) {
        setIsDeleting(false);
        setIsEditing(false);
        setIsConfirmDelete(true);
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

  const handleCloseConfirmation = () => {
    setIsConfirmDelete(false);
    triggerRefresh();
    handleClose();
  }

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

      {isEditing ? 
        (<Modal
        
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
        >
          <ModalOverlay>
          <ModalContent>
          <Flex align="center" w="100%" position="relative">
            <IconButton onClick={onBack} icon={<BsChevronLeft />} position="absolute" left={5} backgroundColor="white"/>
          <ModalHeader flex={1} textAlign="center">{title}</ModalHeader>
          </Flex>
          <ModalBody>
            <Box>
              <CreateEvent eventId={id} event={{
                id: id, 
                title: title, 
                costume: costume, 
                location: location, 
                startTime: startTime, 
                endTime: endTime, 
                callTime: callTime, 
                description: description, 
                level: level, 
                capacity: capacity,
                date: formFormattedDate}}
                onClose={handleSaveChanges}
                triggerRefresh={triggerRefresh}/>
              {console.log(startTime, endTime)}
            </Box>
          </ModalBody>
          </ModalContent>

          </ModalOverlay>
        </Modal>) : 
        (isDeleting ? 
        (
          <DeleteConfirmModal
            isOpen={isOpenProp}
            setIsDeleting={setIsDeleting}
            onConfirmDelete={onConfirmDelete}
            title={title}
            id={id}
          />
        )
          
          : (isConfirmDelete ? 
            (
            <ConfirmationModal
              isOpen={isOpenProp}
              title={title}
              onClose={handleCloseConfirmation}
            />
          ) : 
      (<Modal
        isOpen={isOpenProp}
        size="full"
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
              <HStack justify="space-between">
                  <MdArrowBackIosNew onClick={handleClose}/>
                  <Heading size="lg">{title ? title : "N/A"}</Heading>
                  <Menu>
                    <MenuButton as={IconButton} icon={<MdMoreHoriz />}/>
                    <MenuList>
                      <MenuItem onClick={handleEditEvent}> <BiSolidEdit />
                        Edit</MenuItem>
                      <MenuItem onClick={handleDeleteEvent}><FaRegTrashCan />
                      Delete</MenuItem>
                    </MenuList>
                  </Menu>
              </HStack>
          </ModalHeader>
          <ModalBody>
          {/* <HStack padding={3}>
              <Box width="60%">
                <Text fontWeight="bold">Location:</Text>
                <Text>{location ? location : "N/A"}</Text>
              </Box>
              <Box width="40%" >
                  <Text fontWeight="bold">Date:</Text>
                  <Text>{formattedDate ? formattedDate : "N/A"}</Text>
                </Box>
            </HStack> */}

            <VStack>
              <Box
                bg="gray.200"
                h="100%"
                w="100%"
                mt="4"
                mb="4"
                p="4"
              >
                <Box
                  bg="gray"
                  h="100%"
                  w="100%"
                  p="4"
                  mt="4"
                  color="white"
                >
                  <Center>
                    <QRCode
                      id={id}
                      type="Event"
                    >
                    </QRCode>
                  </Center>
                  <Center>
                    <Button
                      colorScheme="blue"
                      mr={3}
                    >
                      Share
                    </Button>
                  </Center>
                </Box>
                <Box width="100%" align="center">
                  <Text fontWeight="bold"> {rsvpnum ? rsvpnum : 0} RSVPs</Text>
                  <Button
                    onClick={onOpen}
                    variant="unstyled"
                    fontSize="lg"
                    fontWeight="normal"
                    color="purple"
                    textDecoration="underline"
                    _focus={{ boxShadow: "none" }}
                  >
                    View attendees &gt;
                  </Button>
                  <EventRSVP isOpen={isOpen} onClose={onClose} card={{id, name: title}}/>
                </Box>
              </Box>
            </VStack> 
            
            

            <VStack
              spacing={4}
              align="center"
            >
              <HStack spacing={4}
                width={"100%"}
                justifyContent={"space-around"}>
              <Box width="60%">
                <Text fontWeight="bold" fontSize={20}>Location</Text>
                <Text>{location ? location : "N/A"}</Text>
              </Box>
              <Box width="40%" >
                  <Text fontWeight="bold" fontSize={20}>Date</Text>
                  <Text>{formattedDate ? formattedDate : "N/A"}</Text>
                </Box>
              </HStack>

              <Box width="100%">
                <Text fontWeight="bold" fontSize={20}>Event Time</Text>
                <Text>{formattedStartTime ? formattedStartTime : "TBD"} to {formattedEndTime ? formattedEndTime : "TBD"}</Text>
              </Box>

              <Box width="100%">
                <Text fontWeight="bold" fontSize={20}>Call Time</Text>
                <Text>{formattedCallTime ? formattedCallTime : "TBD"}</Text>
              </Box>

              <Box width="100%">
                <Text fontWeight="bold" fontSize={20}>Description</Text>
                <Text>{description ? description: "TBD"}</Text>
              </Box>

              <HStack
                spacing={4}
                width={"100%"}
                justifyContent={"space-around"}
              >
                <Box width="50%">
                  <Text fontWeight="bold" fontSize={20}>Capacity</Text>
                  <Text>{capacity ? capacity : 0}</Text>
                </Box>
                <Box width="50%">
                  <Text fontWeight="bold" fontSize={20}>Level</Text>
                  <Text>{level ? level : "TBD"}</Text>
                </Box>
              </HStack>

              <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold" fontSize={20}>Costume</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack>
              <HStack width="100%">
                {!isCorequisiteSignUp && (
                  <Box>
                    <Text as="b" fontSize={20}>Class Corequisites</Text>
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
            {role === "student" && <Button
              colorScheme="teal"
              onClick={eventSignUp}
            >
              Sign Up
            </Button>}
          </ModalFooter>
        </ModalContent>
      </Modal>)))}
    </>
  );
}

export default TeacherEventViewModal;
