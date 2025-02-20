import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button } from "@chakra-ui/react"
import { UploadComponent } from "./UploadComponent"

export const UploadFileModal = ({ isOpen, onClose, setCurrentModal }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UploadComponent />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3}>
            Next
          </Button>
          <Button colorScheme='blue' mr={3}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    )
}