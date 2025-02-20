import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";

export const ViewModal = ({ isOpen, onClose, setCurrentModal, children, title }) => {
  const onCancel = () => {
    setCurrentModal("cancel");
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody paddingBottom={10}>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};