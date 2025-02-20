import { useEffect } from "react";

import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";

import { CiCircleCheck } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function SuccessSignupModal({
  isOpen,
  title,
  onClose,
  onSuccess = () => {},
  isCoreq: isCorequisiteSignUp,
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        onSuccess();
        onClose();
        if (!isCorequisiteSignUp) navigate("/bookings");
      }, 2000);
    }
  }, [isCorequisiteSignUp, isOpen, navigate, onClose, onSuccess]);

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
          <VStack spacing={10}>
            <VStack
              spacing={4}
              marginTop="5rem"
            >
              <Text>Success!</Text>
              <CiCircleCheck
                color="gray"
                fontSize="10rem"
              />
              <Text textAlign={"center"}>
                You've successfully signed up for <Box as="b">{title}</Box>
              </Text>
            </VStack>

            {!isCorequisiteSignUp && (
              <Button
                colorScheme="teal"
                onClick={onClose}
              >
                View Booking
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SuccessSignupModal;
