import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Input, ModalFooter, Button } from "@chakra-ui/react"

export const UploadLinkModal = ({ isOpen, onClose, setCurrentModal, link, setLink }) => {

    const isValidURL = string => {
      var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
      return (res !== null)
    };
  
    const onGoBack = () => {
      setCurrentModal("select-media")
    }
  
    const onConfirm = () => {
      if (link.length == 0 || !isValidURL(link)) {
        alert("Please type a valid link")
      } else {
        setCurrentModal("select-tag")
      }
    }
  
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <Input value={link}
              onChange={(e) => setLink(e.target.value)}/>
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