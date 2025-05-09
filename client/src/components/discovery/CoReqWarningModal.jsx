import { useEffect, useState } from "react";

import {
  Box,
  Button,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import ClassInfoModal from "./ClassInfoModal";
// import { modalTheme } from "./confirmationModalStyle";
import EventInfoModal from "./EventInfoModal";

function CoReqWarningModal({
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
    // enroll in class
    const userData = await backend.get(`users/${currentUser.uid}`);
    const studentId = userData.data[0].id;

    await backend.post("class-enrollments/", {
      studentId: studentId,
      classId: classId,
    });

    setOpenCoreq(true);
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
    <Box>
      {origin.toUpperCase() === "CLASS" ? (
        <EventInfoModal
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
        size="xl"
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            {/* fix font */}
            <Box color="#2D3748">
              <VStack
                spacing={7}
                // sx={{ border: "2px solid green" }}
              >
                <Box>
                  <VStack
                    spacing="8px"
                    // sx={{ border: "2px solid yellow " }}
                  >
                    <Text
                      fontWeight="bold"
                      fontSize="18px"
                    >
                      {modalIdentity === "class" ? (
                        <Text as="span">Class </Text>
                      ) : (
                        <Text as="span">Event </Text>
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
                        To join {title}, it is recommended that you enroll in
                        the prerequisite class&nbsp;
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

                    <Text>Do you agree to take part in the class?</Text>
                  </VStack>
                </Box>
                <Box
                  // sx={{ border: "2px solid blue" }}
                  w="full"
                >
                  {/* work on responsive button height */}
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
                </Box>
              </VStack>
              <Button
                bg="purple.100"
                color="white"
                onClick={cancelSignUp}
              >
                Cancel
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CoReqWarningModal;
