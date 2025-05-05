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
      // setTimeout(() => {
      //   onClose();
      //   if (!isCorequisiteSignUp) navigate("/bookings");
      // }, 2000);
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
              marginTop="5rem"
            >
              <img src={CompletedIndicator} alt="Completed Indicator" />
              <Text textAlign={"center"} fontWeight="bold" fontSize="xl" mt="2rem">
                Thanks for Signing Up!
              </Text>
              <Text textAlign={"center"}>
                You've successfully signed up for...
              </Text>
              <Text textAlign={"center"}>
                Insert What They Signed Up For Here
              </Text>
            </VStack>

            {!isCorequisiteSignUp && (
              <Button
                bg="#6B46C1"
                color="#FFFFFF"
                onClick={onClose}
                width="100%"
              >
                Find Upcoming Events
              </Button>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default SuccessSignupModal;
