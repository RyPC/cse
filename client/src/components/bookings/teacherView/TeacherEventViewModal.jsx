import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  HStack,
  IconButton,
  Image,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { calcLength } from "framer-motion";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsChevronLeft } from "react-icons/bs";
import {
  FaCircleCheck,
  FaCircleExclamation,
  FaRegTrashCan,
} from "react-icons/fa6";
import { MdArrowBackIosNew, MdMoreHoriz } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  createEmitAndSemanticDiagnosticsBuilderProgram,
  isTemplateExpression,
} from "typescript";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { formatDate, formatTime } from "../../../utils/formatDateTime";
import { formFormatDate } from "../../../utils/formFormatDateTime";
import { ConfirmationModal } from "../../discovery/ConfirmationModal";
import SuccessSignupModal from "../../discovery/SuccessSignupModal";
import { CreateEvent } from "../../forms/createEvent";
import { EventRSVP } from "../../rsvp/eventRsvp";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
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
  const formFormattedDate = formFormatDate(date);
  const toast = useToast();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

  const [tagData, setTagData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDelete, setIsConfirmDelete] = useState(false);

  // disclosure for rsvp
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      position: "top",
      colorScheme: "purple",
    });
    // console.log("Set isEditing to false");
  };

  const onBack = () => {
    setIsEditing(false);
  };

  const handleEditEvent = () => {
    setIsEditing(true);
    // console.log("clicked edit");
  };

  const handleDeleteEvent = () => {
    setIsDeleting(true);
  };

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
        position: "top",
      });
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmDelete(false);
    triggerRefresh();
    handleClose();
  };

  const fetchTags = async () => {
    if (!id) return;
    try {
      const response = await backend.get(`/event-tags/tags/${id}`);

      if (response.data && response.data.length > 0) {
        const responseTags = response.data.map((tagItem) => ({
          id: tagItem.tag_id,
          name: tagItem.tag,
        }));
        setTagData(responseTags);
      } else {
        setTagData([]);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTagData([]);
    }
  };

  useEffect(() => {
    if (!isOpenProp) {
      return;
    }
    fetchTags();
  }, [backend, id, isOpenProp]);

  // what the fuck??
  // useEffect(() => {
  //   if (isOpenProp && !imageSrc) {
  //     fetch("https://dog.ceo/api/breeds/image/random") // for fun
  //       .then((res) => res.json())
  //       .then((data) => setImageSrc(data.message));
  //   }
  // }, [imageSrc, isOpenProp]);

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={handleSuccess}
        isCoreq={isCorequisiteSignUp}
      />

      {isEditing ? (
        <Modal
          isOpen={isOpenProp}
          size="full"
          onClose={handleClose}
        >
          <ModalOverlay>
            <ModalContent>
              <Flex
                align="center"
                w="100%"
                position="relative"
              >
                <IconButton
                  onClick={onBack}
                  icon={<BsChevronLeft />}
                  position="absolute"
                  left={5}
                  backgroundColor="white"
                />
                <ModalHeader
                  flex={1}
                  textAlign="center"
                >
                  {title}
                </ModalHeader>
              </Flex>
              <ModalBody>
                <Box>
                  <CreateEvent
                    eventId={id}
                    event={{
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
                      date: formFormattedDate,
                    }}
                    onClose={handleSaveChanges}
                    triggerRefresh={triggerRefresh}
                  />
                  {console.log(startTime, endTime)}
                </Box>
              </ModalBody>
            </ModalContent>
          </ModalOverlay>
        </Modal>
      ) : isDeleting ? (
        <DeleteConfirmModal
          isOpen={isOpenProp}
          setIsDeleting={setIsDeleting}
          onConfirmDelete={onConfirmDelete}
          title={title}
          id={id}
        />
      ) : isConfirmDelete ? (
        <ConfirmationModal
          isOpen={isOpenProp}
          title={title}
          onClose={handleCloseConfirmation}
        />
      ) : (
        <Modal
          isOpen={isOpenProp}
          size="full"
          onClose={handleClose}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader bg="gray.50">
              <HStack justify="space-between">
                <AiOutlineArrowLeft
                  cursor="pointer"
                  onClick={handleClose}
                />
                <Menu>
                  <MenuButton
                    bg="gray.50"
                    as={IconButton}
                    icon={<MdMoreHoriz />}
                  />
                  <MenuList
                    backgroundColor="gray.100"
                    p={0}
                    minW="auto"
                    w="110px"
                    h="80px"
                  >
                    <MenuItem
                      background="transparent"
                      fontSize="md"
                      onClick={handleEditEvent}
                    >
                      <BiSolidEdit />
                      Edit
                    </MenuItem>
                    <MenuItem
                      background="transparent"
                      fontSize="md"
                      onClick={handleDeleteEvent}
                    >
                      <FaRegTrashCan />
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            </ModalHeader>
            <ModalBody bg="gray.50">
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
                  bg="white"
                  h="100%"
                  w="100%"
                  mb="4"
                  p="4"
                  boxShadow="md"
                  borderRadius="lg"
                >
                  <Center>
                    <QRCode
                      id={id}
                      type="Event"
                    ></QRCode>
                  </Center>
                  <Box
                    width="100%"
                    align="center"
                  >
                    <Text
                      fontSize="1.5rem"
                      fontWeight="bold"
                    >
                      {" "}
                      {rsvpnum ? rsvpnum : 0} People Enrolled
                    </Text>
                    <Button
                      onClick={onOpen}
                      variant="unstyled"
                      fontSize="1.2rem"
                      fontWeight="normal"
                      color="black"
                      textDecoration="underline"
                      _focus={{ boxShadow: "none" }}
                    >
                      <u>View Attendees</u>
                    </Button>
                    <EventRSVP
                      isOpen={isOpen}
                      onClose={onClose}
                      card={{ id, name: title }}
                    />
                  </Box>
                </Box>
              </VStack>

              <VStack
                spacing={4}
                align="center"
              >
                <Flex
                  pt={4}
                  width="100%"
                  justifyContent="flex-start"
                >
                  <Box
                    border={"1px"}
                    borderColor="gray.300"
                    borderRadius="full"
                    px={4}
                  >
                    <Text fontSize="sm">
                      {tagData[0]?.name ? tagData[0].name : "No Tags"}
                    </Text>
                  </Box>
                </Flex>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <Text
                    fontSize="1.8rem"
                    fontWeight="bold"
                  >
                    {title}
                  </Text>
                </Box>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  width="100%"
                ></Box>
                <Box
                  display="flex"
                  justifyContent="flex-start"
                  width="100%"
                >
                  <Text fontSize="16px">{description}</Text>
                </Box>
                <Divider
                  borderColor="gray.400"
                  borderWidth="1px"
                  my={4}
                />
                <Box width="100%">
                  <Text
                    color="purple.700"
                    fontWeight="bold"
                    fontSize="16px"
                  >
                    {formattedDate} ·{" "}
                    {formattedStartTime ? formattedStartTime : "TBD"} -{" "}
                    {formattedEndTime ? formattedEndTime : "TBD"}
                  </Text>
                </Box>
                <Box width="100%">
                  <Text fontSize="16px">{location ? location : "N/A"}</Text>
                </Box>
                <Divider
                  borderColor="gray.400"
                  borderWidth="1px"
                  my={4}
                />
                <Box width="100%">
                  <Text
                    fontWeight="bold"
                    fontSize={20}
                  >
                    Call Time
                  </Text>
                  <Text>{formattedCallTime ? formattedCallTime : "TBD"}</Text>
                </Box>
                <Divider
                  borderColor="gray.400"
                  borderWidth="1px"
                  my={4}
                />

                <HStack
                  spacing={4}
                  width={"100%"}
                  justifyContent={"space-around"}
                >
                  <Box width="50%">
                    <Text
                      fontWeight="bold"
                      fontSize={20}
                    >
                      Capacity
                    </Text>
                    <Text>{capacity ? capacity : 0}</Text>
                  </Box>
                  <Box width="50%">
                    <Text
                      fontWeight="bold"
                      fontSize={20}
                    >
                      Level
                    </Text>
                    <Text>{level ? level : "TBD"}</Text>
                  </Box>
                </HStack>
                <Divider
                  borderColor="gray.400"
                  borderWidth="1px"
                  my={4}
                />

                <HStack width={"100%"}>
                  <Box>
                    <Text
                      fontWeight="bold"
                      fontSize={20}
                    >
                      Costume
                    </Text>
                    <Text>{costume}</Text>
                  </Box>
                </HStack>
                <HStack width="100%">
                  {!isCorequisiteSignUp && (
                    <Box>
                      <Text
                        as="b"
                        fontSize={20}
                      >
                        Event Prerequisites
                      </Text>
                      <Text color="gray.600">
                        We recommend taking these classes before enrolling in
                        this event
                      </Text>
                      {!corequisites || corequisites.length === 0 ? (
                        <Text>No corequisites for this event</Text>
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
              {role === "student" && (
                <Button
                  colorScheme="teal"
                  onClick={eventSignUp}
                >
                  Sign Up
                </Button>
              )}
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default TeacherEventViewModal;
