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

import ClassInfoModal from "./ClassInfoModal";
import EventInfoModal from "./EventInfoModal";

function CoReqWarningModal({
  origin,
  isOpenProp,
  lstCorequisites,
  handleClose = () => {},
  handleCancel = () => {},
}) {
  const [openCoreq, setOpenCoreq] = useState(false);
  const [coreq, setCoreq] = useState(null);

  const handleCoreqModal = () => {
    setOpenCoreq(!openCoreq);
    handleClose();
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
          handleClose={handleCoreqModal}
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
          handleClose={handleCoreqModal}
        />
      )}

      <Modal
        isOpen={isOpenProp}
        size="full"
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
          >
            <VStack spacing={10}>
              <VStack
                spacing={4}
                marginTop="5rem"
              >
                <Text>You still need to sign up for...</Text>

                <Text fontWeight="bold">
                  {lstCorequisites && lstCorequisites.length > 0
                    ? coreq?.title
                    : ""}
                </Text>
              </VStack>
              <VStack>
                <Button
                  colorScheme="teal"
                  onClick={handleCoreqModal}
                >
                  Sign up
                </Button>
                <Button
                  colorScheme="teal"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default CoReqWarningModal;
