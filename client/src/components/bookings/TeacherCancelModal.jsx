import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const TeacherCancelModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  classData,
}) => {
  const { backend } = useBackendContext();

  const onGoBack = () => {
    setCurrentModal("view");
  };
  const onConfirm = async () => {
    try {
      await backend.delete(`/scheduled-classes/${classData.id}`);
      await backend.delete(`/classes/${classData.id}`);
      setCurrentModal("confirmation");
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
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
