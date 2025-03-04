import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalBody, ModalFooter, Flex, Text } from "@chakra-ui/react";

export const DeleteConfirmModal = ({ isOpen, onClose, setCurrentModal, card, handleEvent, type }) => {
    const onGoBack = () => {
        setCurrentModal("view");
    };
    const onConfirm = () => {
        setCurrentModal("confirmation");
        handleEvent(); // sql query is dependent on card type (class or event)
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center" pb={0}>Are you sure you want to delete this {type}?</ModalHeader>
                <ModalBody textAlign="center" py={4}>
                    You're cancelling <Text fontWeight="bold" display="inline">{card ? card.title : "N/A"}</Text>. This action can't be undone.
                </ModalBody>

                <ModalFooter borderTop="1px solid black" p={0}>
                    <Flex w="100%">
                        <Button flex="1" bg="white" borderRight="1px solid black" onClick={onGoBack} borderRadius="0" borderBottomLeftRadius={6} py={6}>
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