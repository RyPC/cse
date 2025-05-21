import { useEffect, useState } from "react";

import {
  Box,
  Button,
  HStack,
  Image,
  Flex,
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
  Tag,
  Divider
} from "@chakra-ui/react";
import { FaTimesCircle } from "react-icons/fa";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import {formatDate} from "../../utils/formatDateTime";
import SuccessSignupModal from "./SuccessSignupModal";

function EventInfoModal({
  user,
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
  corequisites,
  handleResolveCoreq = () => {},
}) {
  const { backend } = useBackendContext();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");
  // const [enrollmentStatus, setEnrollmentStatus] = useState(false);

  // // console.log(user);

  // useEffect(() => {
  //   const checkEventEnrollment = () => {
  //     // Check if already checked into event
  //     console.log(user.data[0].id, id);
  //     const body = {student_id: user.data[0].id, event_id: id};
  //     backend.get(
  //       `/event-enrollments/test`, {body}
  //     ).then(res => {
  //       console.log(res);
  //       setEnrollmentStatus(res.data.exists);
  //     });
  //   };
  //   if (user?.data && user?.data[0]) {
  //     checkEventEnrollment();
  //   } else {
  //     setEnrollmentStatus(false);
  //   }
  // }, [backend, id, user?.data, isOpenProp]);

  const [tags, setTags] = useState([]);
  const [startTime, setStartTime] = useState("");

  const getStartTime = async() => {
    const data = await backend.get(`/events/${id}`)
    setStartTime(data.data[0].startTime)
  }

  const getTags = async () => {
    let tags_arr = [];
    const tags = await backend.get(`/event-tags/tags/${id}`)
    console.log("TAGS from GETTAGS event")
    console.log(tags.data)
    for (let i=0; i<tags.data.length; i++) {
      if (!tags_arr.includes(tags.data[i].tag)) {
        tags_arr.push(tags.data[i].tag)
      }
    }
    setTags(tags_arr)
  }

  const enrollInEvent = async () => {
    // Check if already checked into event
    const currentCheckIn = await backend.get(
      `/event-enrollments/test`,
      {
        params:{
          student_id: user.data[0].id,
          event_id: id
        }
      }
    );
    if (user.data[0] && !currentCheckIn.data.exists) {
      const req = await backend.post(`/event-enrollments/`, {
        student_id: user.data[0].id,
        event_id: id,
        attendance: null
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
    else {
      console.log("Already signed up for this event!");
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

  const parseDate = (dateString) => {
    // https://stackoverflow.com/questions/11591854/format-date-to-mm-dd-yyyy-in-javascript
    const date = new Date(dateString)
    return ((date.getMonth() > 8) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))) + '/' + ((date.getDate() > 9) ? date.getDate() : ('0' + date.getDate())) + '/' + date.getFullYear()
  }
  

  useEffect(() => {
    if (isOpenProp && !imageSrc) {
      fetch("https://dog.ceo/api/breeds/image/random") // for fun
        .then((res) => res.json())
        .then((data) => setImageSrc(data.message));
    }
    getTags()
    getStartTime()
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
            <List>
              {tags.map((tag, index) => (
                <Tag key={index}>
                  {tag}
                </Tag>
              ))}
            </List> 
            <Flex justifyContent="center">
              {title}
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Description: {description}</Text> <br />
            <Divider orientation='horizontal' /> <br /> 
            <Text color="#553C9A">Date: {parseDate(date)} {startTime}</Text> 
            <Text>Location: {location}</Text>     
            <Divider orientation='horizontal' /> <br /> 
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
              
              
              <HStack
                spacing={4}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Box>
                  <Text fontWeight="bold">Capacity</Text>
                  <Text>{capacity}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Level</Text>
                  <Text>{level}</Text>
                </Box>
              </HStack>
              <Divider orientation='horizontal' /> 
              <HStack width="100%">
                {!isCorequisiteSignUp && (
                  <Box bg = "#E8E7EF" borderRadius="md" width = "100%" p={4}>
                    <Text as="b">
                      Recommended
                    </Text>
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
                                  : FaTimesCircle
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
              <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold">Classes</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          <Flex justifyContent="center" width = "100%">
            <ModalFooter>
              <Flex justify = "center">
                <Button
                  width = "100%"
                  p = {7}
                  bg = "purple.600" 
                  color = "white"
                  onClick={eventSignUp}
                >
                  Sign Up
                </Button>
              </Flex>
            </ModalFooter>
          </Flex>
        </ModalContent>
      </Modal>
    </>
  );
}

export default EventInfoModal;
