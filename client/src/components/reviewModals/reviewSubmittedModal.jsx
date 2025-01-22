import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { useDisclosure } from '@chakra-ui/react';

const ReviewSubmittedModal = () => {

    const {isOpen, onClose} = useDisclosure({defaultIsOpen: true});

    return(
        <>
            <Modal isOpen={isOpen}>
                <ModalOverlay>
                    <ModalContent>
                        <ModalHeader>Success!</ModalHeader>
                        <ModalBody>
                            <p>Thank you for taking the time to give us a review!</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button onClick={onClose}>Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalOverlay>
            </Modal>
        </>
    )
};

export default ReviewSubmittedModal;