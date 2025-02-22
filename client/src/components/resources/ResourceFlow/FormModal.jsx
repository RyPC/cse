import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, ModalFooter, Textarea, FormControl, FormLabel, Input } from "@chakra-ui/react"

export const FormModal = ({ isOpen, onClose, setCurrentModal, title, setTitle,  description, setDescription, link, setLink }) => {
    
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Fill out this form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form>
                <FormControl>
                    <FormLabel>Resource Title</FormLabel>
                    <Input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Media Link</FormLabel>
                    <Input
                        required
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </FormControl>
                <br />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='red' mr={3} onClick={() => {
                if (title == "" || description == "" || link == "") {
                    alert("Please fill out every fields")
                } else {
                    setCurrentModal("select-tag")
                }
            }}>
              Next
            </Button>
            <Button colorScheme='blue' mr={3} onClick={() => {setCurrentModal("select-class")}}>
              Go back
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
}