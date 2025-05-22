import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  Flex,
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
  Tag,
  Divider
} from "@chakra-ui/react";

import { FaPencilAlt, FaTimesCircle } from "react-icons/fa";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import PublishedReviews from "../reviews/classReview";
import SuccessSignupModal from "./SuccessSignupModal";
import { formatDate, formatTime } from "../../utils/formatDateTime";

const ClassInfoModal = ({
  userid,
  isOpenProp,
  title,
  location,
  // description,
  // level,
  date,
  // startTime,
  // endTime,
  id,
  // capacity,
  costume,
  isCorequisiteSignUp,
  corequisites,
  handleClose,
  modalIdentity,
  setModalIdentity,
  filteredCorequisites,
  handleResolveCoreq = () => {},
}) => {
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");
  const [tags, setTags] = useState([]);
  const [teacherName, setTeacherName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [level, setLevel] = useState("");

  const getTags = async () => {
    const tags_arr = [];
    const tags = await backend.get(`/class-tags/tags/${id}`)
    // console.log("TAGS from GETTAGS")
    // console.log(tags.data)
    for (let i=0; i<tags.data.length; i++) {
      if (!tags_arr.includes(tags.data[i].tag)) {
        tags_arr.push(tags.data[i].tag)
      }
    }
    setTags(tags_arr)
  }

  const getTeacherName = async() => {
    const teacherName = await backend.get(`/classes-taught/instructor/${id}`)
    console.log("TEACHER'S NAME!")
    console.log(teacherName.data[0])
    setTeacherName(teacherName.data[0].firstName + " " + teacherName.data[0].lastName)
  }

  const getStartTime = async() => {
    const data = await backend.get(`/scheduled-classes/${id}`)
    setStartTime(data.data[0].startTime)
    setEndTime(data.data[0].endTime)
  }

  const enrollInClass = async () => {
    const users = await backend.get(`/users/${currentUser.uid}`);
    if (users.data[0]) {
      const req = await backend.post(`/class-enrollments`, {
        studentId: users.data[0].id,
        classId: id,
        attendance: null,
      });
      if (req.status === 201) {
        setOpenSuccessModal(true);
      }
    }
  };

  const handleSuccess = () => {
    setOpenSuccessModal(false);
    handleClose();
  };

  const classSignUp = async () => {
    console.log("In class signup button");
    console.log(isCorequisiteSignUp);
    corequisites.map((coreq) => {
      console.log(coreq);
    });
    if (isCorequisiteSignUp) {
      console.log("In isCorequisiteSignup clause");
      enrollInClass();
      return;
    }
    // if there exisits a coreq and not enrolled in a coreq,
    if (corequisites.some((coreq) => !coreq.enrolled)) {
      console.log("In handleResolveCoreq clause");
      // let coReqWarningModal know that it should programatically display an event info modal version
      setModalIdentity("class");
      handleResolveCoreq();
    } else {
      console.log("In else clause (enrollInClass())");
      enrollInClass();
    }
  };

  const initClass = async() => {
    const classData = await backend.get(`/classes/${id}`)
    setDescription(classData.data[0].description)
    setCapacity(classData.data[0].capacity)
    setLevel(classData.data[0].level)
  }

  const getPerformance = async() => {
    const performanceData = await backend.get(`/corequisites/${id}`)
    console.log("performance data")
    console.log(performanceData.data)
  }

  useEffect(() => {
    if (isOpenProp) {
      // fetch("https://dog.ceo/api/breeds/image/random") // for fun
      //   .then((res) => res.json())
      //   .then((data) => setImageSrc(data.message));
      getTags();
      getTeacherName();
      getStartTime();
      initClass();
      getPerformance()
    }
  }, [isOpenProp]);

  return (
    <>
      <SuccessSignupModal
        isOpen={openSuccessModal}
        title={title}
        onClose={handleSuccess}
        isCoreq={isCorequisiteSignUp}
      />

      <Modal
        size={"full"}
        isOpen={isOpenProp}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent>

          <ModalHeader>
            <List>
              {tags.map((tag, index) => (
                <Tag key={index} m={1}>
                  {tag}
                </Tag>
              ))}
            </List> 
            {title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Taught by { teacherName ? teacherName : "Unknown" }</Text>
            <Text>{description ? `Description: ${description}` : "No description available."}</Text> <br />

            <Divider orientation='horizontal' /> <br />

            <Text color="#553C9A">{formatDate(date)} · {formatTime(startTime)} – {formatTime(endTime)}</Text>
            <Text>Location: {location}</Text>

            <br/> <Divider orientation='horizontal' /> <br />

            <HStack
              spacing={4}
              width={"100%"}
            >
              <Box width="50%">
                <Text fontWeight="bold">Level</Text>
                <Text>{level}</Text>
              </Box>
              <Box width="50%">
                <Text fontWeight="bold">Capacity</Text>
                <Text>{capacity}</Text>
              </Box>
            </HStack>
            <br/> <Divider orientation='horizontal' /> <br />
            <VStack
              spacing={4}
              align="center"
            >
              {corequisites && corequisites.length !== 0 && (
                <HStack width="100%">
                  <Box
                    bg="#E8E7EF"
                    borderRadius="md"
                    width="100%"
                    p={4}
                  >
                    <VStack
                      align="start"
                      spacing={2}
                    >
                      <HStack align="center">
                        <Text as="b">
                          Recommended classes and events:
                        </Text>
                      </HStack>
                      <List>
                        {corequisites.map((coreq, index) => (
                          <ListItem key={index}>
                            <ListIcon
                              as={
                                coreq.enrolled ? FaCircleCheck : FaTimesCircle
                              }
                            />
                            {coreq.title}
                          </ListItem>
                        ))}
                      </List>
                    </VStack>
                  </Box>
                </HStack>
              )}
            </VStack>
          </ModalBody>
          <Flex
            justifyContent="center"
            width="100%"
          >
            <ModalFooter>
              {role === "student" && (
                <Button
                  width = "100%"
                  p = {7}
                  bg = "purple.600"
                  color = "white"
                  onClick={classSignUp}>Sign up
                </Button>
              )}
            </ModalFooter>
          </Flex>
          <PublishedReviews classId={id} />
        </ModalContent>
        {/* <PublishedReviews
          title={title}
          location={location}
          description={description}
          level={level}
          date={date}
          id={id}
        ></PublishedReviews> */}
      </Modal>
    </>
  );
}

export default ClassInfoModal;
