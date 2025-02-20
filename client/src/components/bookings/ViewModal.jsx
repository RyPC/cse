import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

export const ViewModal = ({ isOpen, onClose, setCurrentModal, children }) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingBottom={10}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};