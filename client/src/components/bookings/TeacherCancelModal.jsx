import { Text, Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Flex } from "@chakra-ui/react";

export const TeacherCancelModal = ({ isOpen, onClose, setCurrentModal, classData }) => {
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
        <ModalHeader textAlign="center">Delete class?</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          <Text>You are deleting {classData.title}. This action can't be undone.</Text>
        </ModalBody>

        <ModalFooter>
          <Flex justifyContent="center" w="100%">
            <Button backgroundColor="#D9D9D9" mr={3} w= "100px" onClick={onGoBack}>
            <Text>Cancel</Text>
            </Button>
            <Button bg="#422E8D" mr={3} w= "100px" onClick={onConfirm}>
              <Text fontWeight="bold" color="white">Delete</Text>
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>

  );
};