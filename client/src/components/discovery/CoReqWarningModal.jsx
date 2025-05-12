import { useEffect, useState } from "react";

import {
  Box,
  Button,
  Center,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { FaX, FaXmark } from "react-icons/fa6";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ClassInfoModal from "./ClassInfoModal";
// import { modalTheme } from "./confirmationModalStyle";
import EventInfoModal from "./EventInfoModal";

function CoReqWarningModal({
  user,
  origin,
  isOpenProp,
  classId,
  lstCorequisites,
  title,
  location,
  description,
  level,
  date,
  id,
  capacity,
  costume,
  modalIdentity,
  setModalIdentity,
  eventId,
  handleClose = () => {},
  killModal = () => {},
}) {
  const { backend } = useBackendContext();
  const { currentUser } = useAuthContext();
  const [openCoreq, setOpenCoreq] = useState(false);
  const [coreq, setCoreq] = useState(null);

  const signupWithCorequisite = async () => {
    // enroll in corequisite
    const userData = await backend.get(`users/${currentUser.uid}`);
    const studentId = userData.data[0].id;

    await backend.post("event-enrollments/", {
      student_id: studentId,
      event_id: coreq.id,
    });

    // enroll in class
    await backend.post("class-enrollments/", {
      studentId: studentId,
      classId: classId,
    });

    setOpenCoreq(true);
    killModal();
  };

  const signupWithoutCorequisite = async () => {
    // enroll in event
    const userData = await backend.get(`users/${currentUser.uid}`);
    const studentId = userData.data[0].id;

    await backend.post("class-enrollments/", {
      studentId: studentId,
      classId: classId,
    });

    setOpenCoreq(true);
    killModal();
  };

  const signupWithCorequisiteEventVersion = async () => {
    const userData = await backend.get(`users/${currentUser.uid}`);
    const studentId = userData.data[0].id;

    // enroll in corequisite class(es)
    await Promise.all(
      lstCorequisites.map((corequisite) =>
        backend
          .post("class-enrollments", {
            studentId: studentId,
            classId: corequisite.id,
          })
          .then((res) => console.log(res))
      )
    );

    // enroll in event
    await backend.post("event-enrollments/", {
      student_id: studentId,
      event_id: eventId,
    });
    killModal();
  };

  const signupWithoutCorequisiteEventVersion = async () => {
    const userData = await backend.get(`users/${currentUser.uid}`);
    const studentId = userData.data[0].id;

    // enroll in event
    await backend.post("event-enrollments/", {
      student_id: studentId,
      event_id: eventId,
    });

    killModal();
  };

  const cancelSignUp = () => {
    setOpenCoreq(false);
    handleClose();
    killModal();
  };

  useEffect(() => {
    if (lstCorequisites.length > 0) {
      setCoreq(
        lstCorequisites.find((coreq) => coreq.enrolled === false) || null
      );
    }
  }, [lstCorequisites]);

  if (!coreq || !lstCorequisites || lstCorequisites.length === 0) {
    return null;
  }
  return (
    // <Box
    //   h="100vh"
    //   sx={{ border: "1px solid red" }}
    // >
    // <Center>
    <Box>
      {origin.toUpperCase() === "CLASS" ? (
        <EventInfoModal
          user={user}
          isOpenProp={openCoreq}
          id={coreq.id}
          title={coreq.title}
          location={coreq.location}
          description={coreq.description}
          level={coreq.level}
          date={coreq.date}
          capacity={coreq.capacity}
          costume={coreq.costume}
          isCorequisiteSignUp={true}
          handleClose={cancelSignUp}
        />
      ) : (
        <ClassInfoModal
          user={user}
          isOpenProp={openCoreq}
          title={coreq.title}
          description={coreq.description}
          location={coreq.location}
          date={coreq.date}
          capacity={coreq.capacity}
          costume={coreq.costume}
          level={coreq.level}
          id={coreq.id}
          isCorequisiteSignUp={true}
          handleClose={cancelSignUp}
        />
      )}

      <Modal
        isOpen={isOpenProp}
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent w="90vw">
          <ModalBody p={5}>
            <Box
            // sx={{ border: "1px solid red" }}
            >
              <VStack spacing={5}>
                <Box
                  w="full"
                  // sx={{ border: "1px solid yellow" }}
                  display="flex"
                  justifyContent="flex-end"
                >
                  <FaX onClick={cancelSignUp} />
                </Box>
                {/* fix font */}
                <Box
                  color="#2D3748"
                  // sx={{ border: "2px solid green" }}
                >
                  <VStack
                    spacing={7}
                    // sx={{ border: "2px solid green" }}
                  >
                    <Box
                    // sx={{ border: "1px solid blue" }}
                    >
                      <VStack
                        spacing="8px"
                        // sx={{ border: "2px solid yellow " }}
                      >
                        <Text
                          fontWeight="bold"
                          fontSize="18px"
                        >
                          {modalIdentity === "class" ? (
                            <Text as="span">Event </Text>
                          ) : (
                            <Text as="span">Class </Text>
                          )}
                          Participation Recommended
                        </Text>

                        {modalIdentity === "class" ? (
                          <Text>
                            {/* handle multiple performances grammar */}
                            To enroll in {title}, it is recommended that you
                            participate in the end-of-session performance&nbsp;
                            <Text
                              as="span"
                              fontWeight="bold"
                            >
                              {lstCorequisites && lstCorequisites.length > 0
                                ? coreq?.title
                                : ""}
                            </Text>
                            .
                          </Text>
                        ) : (
                          <Text>
                            {/* handle multiple performances grammar */}
                            To join {title}, it is recommended that you enroll
                            in the prerequisite{" "}
                            {lstCorequisites.length > 1 ? (
                              <Text as="span">classes</Text>
                            ) : (
                              <Text as="span">class</Text>
                            )}
                            &nbsp;
                            <Text
                              as="span"
                              fontWeight="bold"
                            >
                              {lstCorequisites && lstCorequisites.length > 0
                                ? coreq?.title
                                : ""}
                            </Text>
                            .
                          </Text>
                        )}

                        <Text>
                          Do you agree to take part in{" "}
                          {lstCorequisites.length > 1 ? (
                            <Text as="span">these classes?</Text>
                          ) : (
                            <Text as="span">the class?</Text>
                          )}
                        </Text>
                      </VStack>
                    </Box>
                    <Box
                      // sx={{ border: "2px solid blue" }}
                      w="full"
                    >
                      {modalIdentity === "class" ? (
                        <VStack spacing="8px">
                          <Button
                            w="full"
                            bg="purple.100"
                            color="white"
                            onClick={signupWithCorequisite}
                          >
                            Yes, Enroll & Join Performance
                          </Button>
                          <Button
                            w="full"
                            bg="#CBD5E0"
                            color="#4A5568"
                            onClick={signupWithoutCorequisite}
                          >
                            No, Enroll in Class Only
                          </Button>
                        </VStack>
                      ) : (
                        <VStack spacing="8px">
                          <Button
                            w="full"
                            bg="purple.100"
                            color="white"
                            onClick={signupWithCorequisiteEventVersion}
                          >
                            Yes, Join & Enroll in&nbsp;
                            {lstCorequisites.length > 1 ? (
                              <Text as="span">Classes</Text>
                            ) : (
                              <Text as="span">Class</Text>
                            )}
                          </Button>
                          <Button
                            w="full"
                            bg="#CBD5E0"
                            color="#4A5568"
                            onClick={signupWithoutCorequisiteEventVersion}
                          >
                            No, Join Performance Only
                          </Button>
                        </VStack>
                      )}
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
    //   </Center>
    // </Box>
  );
}

export default CoReqWarningModal;
