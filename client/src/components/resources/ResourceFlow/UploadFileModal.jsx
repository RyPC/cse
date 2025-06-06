import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";

import { IoIosArrowBack } from "react-icons/io";

import { ProgressBar } from "./ProgressBar";
import { UploadComponent } from "./UploadComponent";

export const UploadFileModal = ({
  isOpen,
  onClose,
  setCurrentModal,
  s3URL,
  setS3URL,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <IconButton
            aria-label="Search database"
            variant="ghost"
            onClick={() => {
              setCurrentModal("select-tag");
            }}
          >
            <IoIosArrowBack />
          </IconButton>
          Upload File
          <ProgressBar currStep={4} />
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UploadComponent setS3URL={setS3URL} />
        </ModalBody>
        <ModalFooter>
          <VStack
            spacing={8}
            sx={{ maxWidth: "100%", marginX: "auto" }}
          >
            <Button
              colorScheme="gray"
              mr={3}
              onClick={() => {
                if (s3URL === "") {
                  alert("You must upload a file first!");
                } else {
                  setCurrentModal("card");
                }
              }}
            >
              Next
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
