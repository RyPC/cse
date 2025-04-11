import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Box, Icon, VStack } from "@chakra-ui/react";
import CompletedIndicator from "./CompletedIndicator.png"



export const ConfirmationModal = ({ isOpen, onClose, card }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader py={3}>
            </ModalHeader>
            <VStack>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    w="150px" 
                    h="150px"
                    borderRadius="full"
                    bg="#d9d9d9"
                >
                    <img src={CompletedIndicator} alt="Completed Indicator" />
                </Box>
            </VStack>
            <ModalBody textAlign="center" fontSize="2xl" fontWeight="bold">
                You've successfully cancelled {card ? card.title : "N/A"}.
            </ModalBody>

            <ModalFooter justifyContent="center">
                <Button bg="#422E8D" color = "white" width="60%" mr={3} onClick={onClose}>
                    View Booked Events
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  );
};