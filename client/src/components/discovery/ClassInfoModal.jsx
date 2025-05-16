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
} from "@chakra-ui/react";

import { FaPencilAlt, FaTimesCircle } from "react-icons/fa";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import PublishedReviews from "../reviews/classReview";
import SuccessSignupModal from "./SuccessSignupModal";

function ClassInfoModal({
  userid,
  isOpenProp,
  title,
  location,
  description,
  level,
  date,
  startTime,
  endTime,
  id,
  capacity,
  costume,
  isCorequisiteSignUp,
  corequisites,
  handleClose,
  modalIdentity,
  setModalIdentity,
  filteredCorequisites,
  handleResolveCoreq = () => {},
}) {
  const { currentUser, role } = useAuthContext();
  const { backend } = useBackendContext();

  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  // temp for image
  const [imageSrc, setImageSrc] = useState("");

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
              {!isCorequisiteSignUp && (
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
                        <Text as="b">Recommended</Text>
                      </HStack>
                      {!corequisites || corequisites.length === 0 ? (
                        <Text>No corequisites for this class</Text>
                      ) : (
                        <List>
                          {filteredCorequisites.map((coreq, index) => (
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
                      )}
                    </VStack>
                  </Box>
                </HStack>
              )}
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
                  <Text fontWeight="bold">Location</Text>
                  <Text>{location}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Date</Text>
                  <Text>{date}</Text>
                </Box>
              </HStack>

              <Box width="100%">
                <Box>
                  <Text fontWeight="bold">Time</Text>
                  <Text>pass in time prop and use it</Text>
                </Box>
                <Text fontWeight="bold">Description:</Text>
                <Text>{description}</Text>
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

              <HStack width={"100%"}>
                <Box>
                  <Text fontWeight="bold">Classes</Text>
                  <Text>{costume}</Text>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          <Flex
            justifyContent="center"
            width="100%"
          >
            <ModalFooter>
              {role === "student" && (
                <Button
                  width="100%"
                  p={7}
                  bg="#422E8D"
                  color="white"
                  onClick={classSignUp}
                >
                  Sign up
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
