import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";

const SaveClassAsDraftModal = ({ isOpen, onClose, postClass }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Save Class as Draft</ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center">
          Would you like to save this class as a draft?
        </ModalBody>
        <ModalFooter>
          <Stack
            direction="row"
            justifyContent="center"
            width="100%"
          >
            <Button
              colorScheme="purple"
              bgColor="purple.600"
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
            <Button onClick={postClass}>Save as Draft</Button>
          </Stack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SaveClassAsDraftModal;
