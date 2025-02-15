import { useState } from "react";

import { ConfirmationModal } from "../bookings/ConfirmationModal";
import { CancelModal } from "../bookings/CancelModal";

import { Button, Box, useDisclosure, Heading, VStack, Modal, ModalOverlay, ModalHeader, ModalContent, ModalCloseButton, ModalBody, ModalFooter, Input} from "@chakra-ui/react";


const SelectMediaModal = ({ isOpen, onClose, setCurrentModal }) => {
  const onPhoto = () => {
    setCurrentModal("upload-photo");
  };

  const onLink = () => {
    setCurrentModal("upload-link");
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Media</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button onClick={onPhoto}>
            Photo
          </Button>
          <Button onClick={onLink}>
            Link
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const UploadLinkModal = ({ isOpen, onClose, setCurrentModal }) => {

  const onGoBack = () => {
    setCurrentModal("select-media")
  }

  const onConfirm = () => {
    setCurrentModal("select-tag")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Upload Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input />
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

const SelectTagModal = ({ isOpen, onClose, setCurrentModal }) => {

  const onGoBack = () => {
    setCurrentModal("select-media")
  }

  const onConfirm = () => {
    setCurrentModal("card")
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Tag Modal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Button>
            Ballet
          </Button>
          <Button>
            Classical
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='red' mr={3} onClick={onConfirm}>
            Confirm
          </Button>
          <Button colorScheme='blue' mr={3} onClick={onGoBack}>
            Go back
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export const Playground = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [currentModal, setCurrentModal] = useState("select-media");
  const [ tags, setTags ] = useState([])

  const onCloseModal = () => {
    setCurrentModal("select-media");
    onClose();
  };


  const addTag = (value) => {
    setTags(tags.concat([value]))
  }


  const removeTag = (value) => {
    setTags(tags.filter(item => item !== value))
  }


  return (
    <Box>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto" }}
      >
        <Heading>Resource Flows for Teacher</Heading>


      <Button onClick={onOpen}>
        Initiate
      </Button>
      </VStack>
      {
        currentModal === "select-media" ?
          <SelectMediaModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} /> :
        (currentModal === "upload-link" ?
          <UploadLinkModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal}/> :
        (currentModal === "select-tag" ?
          <SelectTagModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} /> :
          <CancelModal isOpen={isOpen} onClose={onCloseModal} setCurrentModal={setCurrentModal} />
        )
        )
      }
    </Box>

  );
};
