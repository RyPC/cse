import { useEffect } from "react";

import {
  Box,
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { MdCheckCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function SuccessSignupModal({
  isOpen,
  title,
  onClose,
  isCoreq: isCorequisiteSignUp = false,
  corequisites = [],
  withCoreqFlag = false,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onClose();
        if (!isCorequisiteSignUp) navigate("/bookings");
      }, 2000);
    }
  }, [isCorequisiteSignUp, isOpen, navigate, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      size="full"
      onClose={() => {}}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody
          display={"flex"}
          justifyContent={"center"}
        >
          <VStack
            // spacing={150}
            minh={"100vh"}
            justify={"center"}
          >
            <VStack spacing={4}>
              {/* <img src={CompletedIndicator} alt="Completed Indicator" /> */}
              <Box color="purple.600">
                <MdCheckCircle fontSize={"9rem"} />
              </Box>
              <Text textAlign={"center"}>
                You've successfully signed up for <Box as="b">{title}</Box>
              </Text>
            </VStack>

            {withCoreqFlag && corequisites.length > 0 && (
              <UnorderedList listStyleType="disc">
                {corequisites.map((coreq) => (
                  <ListItem
                    key={coreq.id}
                    display="flex"
                    alignItems="center"
                    fontSize="lg"
                    listStyleType={""}
                  >
                    <Text>{coreq.title}</Text>
                  </ListItem>
                ))}
              </UnorderedList>
            )}

            {!isCorequisiteSignUp && (
              <Button
                bg="purple.600"
                color="#FFFFFF"
                onClick={onClose}
              >
                View Booked Events
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SuccessSignupModal;
