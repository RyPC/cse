import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

export const CancelModal = ({ isOpen, onClose, setCurrentModal }) => {
  const onGoBack = () => {
    setCurrentModal("view");
  };
  const onConfirm = () => {
    setCurrentModal("confirmation");
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
};