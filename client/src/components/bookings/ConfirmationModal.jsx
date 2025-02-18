import { Button, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Box, Icon, VStack } from "@chakra-ui/react";
import { MdCheck } from "react-icons/md";


export const ConfirmationModal = ({ isOpen, onClose, item }) => {
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
                    <Icon as={MdCheck} boxSize={20} color="black"/>
                </Box>
            </VStack>
            <ModalBody textAlign="center" fontSize="2xl" fontWeight="bold">
                You've successfully cancelled {item ? item.title : "N/A"}.
            </ModalBody>

            <ModalFooter justifyContent="center">
                <Button bg="#d9d9d9" width="100%" mr={3} onClick={onClose}>
                    Back to Booked Events Page
                </Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
  );
};