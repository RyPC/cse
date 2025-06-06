import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

export const SelectMediaModal = ({ isOpen, onClose, setCurrentModal }) => {
  const onPhoto = () => {
    setCurrentModal("upload-photo");
  };

  const onLink = () => {
    setCurrentModal("upload-link");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Media</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button onClick={onPhoto}>Photo</Button>
          <Button onClick={onLink}>Link</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
