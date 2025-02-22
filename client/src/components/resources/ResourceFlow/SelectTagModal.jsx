import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, ModalFooter } from "@chakra-ui/react"

export const SelectTagModal = ({ isOpen, onClose, setCurrentModal, tags, setTags }) => {

    const onGoBack = () => {
      setCurrentModal("form")
    }
  
    const onConfirm = () => {
      setCurrentModal("upload-photo")
    }
  
    const addTag = (value) => {
      setTags(tags.concat([value]))
    }
  
    const removeTag = (value) => {
      setTags(tags.filter(item => item !== value))
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Tag Modal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button 
            colorScheme={tags.includes("ballet") ? "teal" : "blue"}
            onClick={() => {
              if (tags.includes("ballet")) {
                removeTag("ballet")
              } else {
                addTag("ballet")
              }
            }}
            >
              Ballet
            </Button>
            <Button 
            colorScheme={tags.includes("classical") ? "teal" : "blue"}
            onClick={() => {
              if (tags.includes("classical")) {
                removeTag("classical")
              } else {
                addTag("classical")
              }}
            }
            >
              Classical
            </Button>
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
  