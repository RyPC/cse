import { Icon, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Flex, Text, VStack } from "@chakra-ui/react";

import { BsCheck } from "react-icons/bs";

export const ConfirmClassDeleteModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={() => {window.location.reload()}}>
      <ModalOverlay />
      <ModalContent>
        <VStack>
          <Flex paddingTop={5} justifyContent="center" w="100%" position="relative">
            <Icon as={BsCheck} boxSize="80%" backgroundColor="#134A74" borderRadius="full" color="white"></Icon>
          </Flex>
          <Text fontSize="28px" fontWeight="bold">Class Deleted</Text>
        <ModalFooter>
          <Button backgroundColor="#D9D9D9" padding={7} onClick={() => {window.location.reload()}}>
          Back to Dashboard          </Button>
        </ModalFooter>
        </VStack>
      </ModalContent>
    </Modal>
  );
};