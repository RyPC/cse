import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, Flex, Text } from "@chakra-ui/react";

export const DeleteConfirmModal = ({ isOpen, setIsDeleting, title, id }) => {
    const onClose = () => {
        setIsDeleting(false);
    };

    const onConfirm = async () => {
        try {
          const response = await backend.delete(`/events/${id}`);
          if (response.status === 200) {
            toast({
              title: "Event deleted",
              status: "success",
              duration: 5000,
              isClosable: true,
            });
            handleClose();
            window.location.reload();
          }
        } catch (error) {
          toast({
            title: "Error deleting event",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center" pb={0}>Are you sure you want to delete this event?</ModalHeader>
                <ModalBody textAlign="center" py={4}>
                    You're cancelling <Text fontWeight="bold" display="inline">{title ? title : "N/A"}</Text>. This action can't be undone.
                </ModalBody>

                <ModalFooter borderTop="1px solid black" p={0}>
                    <Flex w="100%">
                        <Button flex="1" bg="white" borderRight="1px solid black" onClick={onClose} borderRadius="0" borderBottomLeftRadius={6} py={6}>
                            Close
                        </Button>
                        <Button flex="1" bg="white" fontWeight="bold" onClick={onConfirm} borderRadius="0" borderBottomRightRadius={6} py={6}>
                            Confirm
                        </Button>
                    </Flex>
                </ModalFooter>

            </ModalContent>
        </Modal>
  );
};