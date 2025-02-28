import { 
    Box, Text, VStack, HStack, Heading,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, 
    Table, TableContainer, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react"

import { MdArrowBackIosNew } from "react-icons/md";

export const ClassRSVP = ({ isOpen, onClose, card }) => {
  // TODO: Simulate class card clicking -> displaying information here
  //        might have to make a new endpoint to get all the information
  // TOOD: Look around for an endpoint that gives me correct info, if not make a new one

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
    >
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <HStack justifyContent="center" position="relative">
            <Box position="absolute" left={0}><MdArrowBackIosNew onClick={onClose}/></Box>
            <Heading size="lg">RSVP's for Ballet A</Heading>
          </HStack>
        </ModalHeader>
        <ModalBody px={0}>
          <TableContainer> {/* TODO: Rethink about using charkaUI table, idk if i want to use it */}
            <Table variant="simple">
              <Thead>
                <Tr borderBottom="2px solid #757575">
                  <Th fontSize="xl" textTransform="none" fontWeight="semibold" color="black">Student</Th>
                  <Th fontSize="xl" textTransform="none" fontWeight="semibold" color="black" textAlign="right">Checked In</Th>
                </Tr>
              </Thead>
              <Tbody> {/* TOOD: Dynamically load multiple rows based on backend response */}
                <Tr borderBottom="2px solid #757575">
                  <Td>Joshua Sullivan</Td>
                  <Td textAlign="center">✅</Td> {/* TODO: Proper centering, look into table stuff ig */}
                </Tr>
                <Tr borderBottom="2px solid #757575">
                  <Td>Raymond Yan</Td>
                  <Td textAlign="center">❌</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};