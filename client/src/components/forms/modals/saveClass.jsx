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

const SaveClass = ({ isOpen, onClose, postClass }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="md"
            isCentered
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader textAlign="center">Save Class</ModalHeader>
                <ModalCloseButton />
                <ModalBody textAlign="center">
                    Would you like to save this class?
                </ModalBody>
                <ModalFooter>
                    <Stack
                        direction="row"
                        justifyContent="center"
                        width="100%"
                    >
                        <Button
                            colorScheme="blue"
                            mr={3}
                            onClick={onClose}
                        >
                            Close
                        </Button>
                        <Button onClick={postClass}>Save Class</Button>
                    </Stack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default SaveClass;
