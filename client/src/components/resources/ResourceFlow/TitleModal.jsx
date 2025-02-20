import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, Input, ModalFooter } from "@chakra-ui/react"

export const TitleModal = ({ isOpen, onClose, setCurrentModal, title, setTitle }) => {
    const onGoBack = () => {
      setCurrentModal("select-tag")
    }
  
    const onConfirm = () => {
      setCurrentModal("card")
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input value={title}
            onChange={(e) => {
                if (e.target.value.length == 0) {
                alert("Title cannot be empty")
                } else {
                setTitle(e.target.value)
                }
            }}/>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={onConfirm}>
              Next
            </Button>
            <Button colorScheme='blue' mr={3} onClick={onGoBack}>
              Go back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}