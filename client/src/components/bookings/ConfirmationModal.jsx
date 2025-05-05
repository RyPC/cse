import { Button, Text, Modal, ModalOverlay, ModalContent, ModalBody, VStack } from "@chakra-ui/react";
import CompletedIndicator from "./CompletedIndicator.png"


export const ConfirmationModal = ({ isOpen, onClose, card }) => {
  return (
    <Modal 
        isOpen={isOpen} 
        size="full" 
        onClose={() => {}}
    >
        <ModalOverlay />
        <ModalContent>
            <ModalBody
                display={"flex"}
                justifyContent={"center"}
            >
                <VStack 
                    spacing={10}
                    minH = {"100vh"}
                    justify= {"center"}
                    marginBottom={"10vh"}
                >
                    <VStack
                        marginTop="5rem"
                    >
                        <img src={CompletedIndicator} alt="Completed Indicator" />
                        <Text textAlign={"center"} fontWeight="bold" fontSize="xl" mt="2rem">
                            Sorry to See You Go!
                        </Text>
                        <Text textAlign={"center"}>
                            Your RSVP has been removed for {card ? card.title : "N/A"}
                        </Text>
                    </VStack>

                    <Button
                        bg="#6B46C1"
                        color="#FFFFFF"
                        onClick={onClose}
                        width="100%"
                    >
                        Find Upcoming Events
                    </Button>
                </VStack>
            </ModalBody>
        </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;