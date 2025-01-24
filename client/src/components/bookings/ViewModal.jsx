import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

export const ViewModal = ({ isOpen, onClose, setCurrentModal }) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};