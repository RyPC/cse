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
import CompletedIndicator from "./CompletedIndicator.png"


function SuccessSignupModal({
  isOpen,
  title,
  onClose,
  isCoreq: isCorequisiteSignUp,
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
            spacing={10}
            minh = {"100vh"}
            justify= {"center"}
          >
            <VStack
              spacing={4}
              marginTop="5rem"
            >
              <img src={CompletedIndicator} alt="Completed Indicator" />
              <Text textAlign={"center"}>
                You've successfully signed up for <Box as="b">{title}</Box>
              </Text>
            </VStack>

            {!isCorequisiteSignUp && (
              <Button
                bg="#422E8D"
                color = "#FFFFFF"
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
