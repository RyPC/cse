import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

export const ConfirmationModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Changes made to class ____...</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam lacinia cursus tortor et tempor. Mauris vulputate mattis feugiat. Fusce dignissim quis diam sit amet euismod. Vestibulum pulvinar interdum nisl. Aenean vel porta sem, id efficitur justo. Vestibulum vitae eros volutpat, tincidunt est interdum, hendrerit sem. Vestibulum porttitor orci a leo vulputate, vitae suscipit lacus tristique.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Go Home
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};