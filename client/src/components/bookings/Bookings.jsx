import { useEffect, useState } from "react";

import { Button, Box, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Heading, VStack } from "@chakra-ui/react";

import { Link } from "react-router-dom";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleClickEvents = () => {
    console.log("Booked events button has been pressed!");
  };
  const handleClickClasses = () => {
    console.log("Booked classes button has been pressed!");
  };
  const handleClickHistory = () => {
    console.log("Booked history button has been pressed!");
  };

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Bookings</Heading>
        <div>
          <Button onClick={onOpen}>Events</Button>
          <Button onClick={handleClickClasses}>Classes</Button>
          <Button onClick={handleClickHistory}>History</Button>
          
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Title</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                description
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        </div>
      </VStack>
    </Box>
  );
};
