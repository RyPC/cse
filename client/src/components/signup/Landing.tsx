import React, { useState } from "react";

import {
  Button,
  Divider,
  Flex,
  Text,
  useDisclosure, // Import useDisclosure hook
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";

import { Login } from "../login/Login";
import AuthorityModal from "./AuthorityModal"; // Assuming AuthorityModal is in the same directory or adjust path

export const Landing = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Use Chakra's disclosure hook for modal state

  // This function will be called when an authority is selected in the modal
  const handleSelectAuthority = (authority: "student" | "teacher") => {
    onClose();
    if (authority === "student") {
      navigate("/signup/student"); // Navigate to student signup page
    } else if (authority === "teacher") {
      navigate("/signup/teacher"); // Navigate to teacher signup page
    }
  };

  // This function now opens the modal instead of navigating directly
  const handleSignupClick = () => {
    onOpen();
  };

  return (
    <>
      <VStack
        justifyContent="center"
        alignItems="center"
        height={"100vh"}
      >
        {/* Showing the login page directly */}
        <Login />
        <Flex
          alignItems="center"
          w={"48.2587vw"}
          my={4}
        >
          <Divider borderColor="gray.300" />
          <Text
            mx={2}
            color="gray.500"
            whiteSpace="nowrap"
          >
            OR
          </Text>
          <Divider borderColor="gray.300" />
        </Flex>
        <Button
          type="button" // Changed from submit as it's not submitting a form here
          size={"lg"}
          bg="#E2E8F0"
          w={"48.2587vw"}
          color="white"
          mt={4}
          onClick={handleSignupClick} // Call the function to open the modal
          textColor={"#71717A"}
        >
          Signup
        </Button>
      </VStack>

      {/* Render the AuthorityModal */}
      <AuthorityModal
        isOpen={isOpen}
        onClose={onClose}
        onSelectAuthority={handleSelectAuthority}
      />
    </>
  );
};
