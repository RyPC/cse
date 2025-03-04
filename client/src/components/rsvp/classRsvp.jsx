import { 
    Box, Text, VStack, HStack, Heading, Flex, Avatar,
    Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, 
    Table, TableContainer, Thead, Tbody, Tr, Th, Td,
} from "@chakra-ui/react"

import { MdArrowBackIosNew } from "react-icons/md";

export const ClassRSVP = ({ isOpen, onClose, card }) => {
  // TODO: Simulate class card clicking -> displaying information here
  //        might have to make a new endpoint to get all the information
  // TOOD: Look around for an endpoint that gives me correct info, if not make a new one
  const users = [
    {name: "Joshua Sullivan", contact:"joshee.sullivan@gmail.com", checkedIn: true},
    {name: "Raymond Yan", contact:"raymond.yan@gmail.com", checkedIn: false},
    {name: "Ethan Ho", contact:"ethan.ho@gmail.com", checkedIn: false},
    {name: "Steven Zhou", contact:"steven.zhou@gmail.com", checkedIn: true},
  ];

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
            <Table variant="unstyled">
              <Thead>
                <Tr borderBottom="1px solid #757575">
                  <Th fontSize="xl" textTransform="none" fontWeight="semibold">Student</Th>
                  <Th fontSize="xl" textTransform="none" fontWeight="semibold" textAlign="right">Checked In</Th>
                </Tr>
              </Thead>
              <Tbody> {/* TOOD: Dynamically load multiple rows based on backend response AND fix "whitespace" issue*/}
                {users && users.length > 0 ? users.map((user, index) => (
                  <Tr borderBottom="1px solid #757575" key={index}> {/* key can eventually be user.id */}
                    <Td px={0}>
                      <Flex align="center">
                        <Avatar mx={4} size="md" bg="gray.300"/>
                        <Box>
                          <Text fontSize="sm" fontWeight="semibold">{user.name}</Text>
                          <Text fontSize="xs">{user.contact}</Text>
                        </Box>
                      </Flex>
                    </Td>
                    <Td p={0} textAlign="center">{user.checkedIn ? "✅" : "❌"}</Td> {/* TODO: Proper centering, look into table stuff ig */}
                  </Tr>
                ))
                  : 
                  <Tr><Td>No students have RSVP'd</Td></Tr>
                }
              </Tbody>
            </Table>
          </TableContainer>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};