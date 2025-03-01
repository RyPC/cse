import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Button, ModalFooter, IconButton, VStack } from "@chakra-ui/react"
import { IoIosArrowBack } from "react-icons/io";
import { ProgressBar } from "./ProgressBar";


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
          <ModalHeader>
            <IconButton aria-label="Search database" variant='ghost' onClick={onGoBack}>
              <IoIosArrowBack />
            </IconButton>
            Select Tag Modal
            <ProgressBar currStep={3}/>
          </ModalHeader>
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
            <VStack
                spacing={8}
                sx={{ maxWidth: "100%", marginX: "auto" }}
              >
              <Button colorScheme='gray' mr={3} onClick={onConfirm}>
                Next
              </Button>
            </VStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
  