import { useEffect, useState } from "react";

import { Button, Box, useDisclosure, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Heading, VStack } from "@chakra-ui/react";

import { Link } from "react-router-dom";

export const Bookings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("view");

  const onCancel = () => {
    setCurrentModal("cancel");
  };
  const onCloseModal = () => {
    setCurrentModal("view");
    onClose();
  };
  const onGoBack = () => {
    setCurrentModal("view");
  };
  const onConfirm = () => {
    setCurrentModal("confirmation");
  };

  const handleClickEvents = () => {
    console.log("Booked events button has been pressed!");
  };
  const handleClickClasses = () => {
    console.log("Booked classes button has been pressed!");
  };
  const handleClickHistory = () => {
    console.log("Booked history button has been pressed!");
  };

  const selectModal = () => {
    if (currentModal === "view") {
      return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia cursus tortor et tempor. Mauris vulputate mattis feugiat. Fusce dignissim quis diam sit amet euismod. Vestibulum pulvinar interdum nisl. Aenean vel porta sem, id efficitur justo. Vestibulum vitae eros volutpat, tincidunt est interdum, hendrerit sem. Vestibulum porttitor orci a leo vulputate, vitae suscipit lacus tristique.
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onCancel}>
                Cancel
              </Button>
              <Button colorScheme='blue' mr={3} onClick={onCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    }
    else if (currentModal === "cancel") {
      return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            Are you sure?
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='red' mr={3} onClick={onConfirm}>
                Confirm
              </Button>
              <Button colorScheme='blue' mr={3} onClick={onGoBack}>
                Go back
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    }
    else if (currentModal === "confirmation") {
      return (
        <Modal isOpen={isOpen} onClose={onCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            Changes made to class ____...
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia cursus tortor et tempor. Mauris vulputate mattis feugiat. Fusce dignissim quis diam sit amet euismod. Vestibulum pulvinar interdum nisl. Aenean vel porta sem, id efficitur justo. Vestibulum vitae eros volutpat, tincidunt est interdum, hendrerit sem. Vestibulum porttitor orci a leo vulputate, vitae suscipit lacus tristique.
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onCloseModal}>
                Go Home
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      );
    }
  };

  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Bookings</Heading>
        <div>
          <Button onClick={handleClickEvents}>Events</Button>
          <Button onClick={handleClickClasses}>Classes</Button>
          <Button onClick={handleClickHistory}>History</Button>
        </div>

      <Box
        p="50"
        borderWidth="1px"
        borderColor="black"
        onClick={onOpen}
      >
        Class Sample
      </Box>
      </VStack>
      {selectModal()}
    </Box>
  );
};
