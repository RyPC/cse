import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { FiTrash2 } from "react-icons/fi";
import { SlArrowLeft } from "react-icons/sl";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { NotificationPanel } from "../NotificationPanel";

export const StudentDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notifRef } = useRef();
  const { backend } = useBackendContext();
  const [students, setStudents] = useState([]);
  const [classCount, setClassCount] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/students");
        setStudents(response.data);

        const countResponse = await backend.get("/class-enrollments/student-class-count");
        setClassCount(countResponse.data);
        
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [backend]);

  return (
    <VStack>
      <Flex
        w={"100%"}
        justify={"space-between"}
      >
        <Heading
          as="h1"
          size="lg"
          mb={4}
          alignSelf={"flex-start"}
          alignContent="center"
          fontWeight={700}
          fontSize={36}
        >
          <Button
            backgroundColor="transparent"
            fontSize={25}
            mb={1}
            onClick={() => navigate("/dashboard")}
          >
            <SlArrowLeft />
          </Button>
          Students
        </Heading>
        <Image
          alignSelf={"flex-end"}
          cursor="pointer"
          onClick={onOpen}
          ref={notifRef}
          src="../bell.png"
        />
        <NotificationPanel
          isOpen={isOpen}
          onClose={onClose}
        />
      </Flex>
      <Box
        w="100%"
        pl={20}
      >
        SEARCH BAR HERE
      </Box>
      <TableContainer
        w="100%"
        sx={{
          overflowX: "auto",
        }}
        pl={20}
      >
        <Table colorScheme="gray">
          <Thead>
            <Tr>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Student
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Email
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Classes
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {students
              ? students.map((stud, index) => (
                  <Tr
                    key={stud.id}
                    onClick={() => navigate(`/dashboard/students/${stud.id}`)}
                    backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                    _hover={{ bg: "gray.300", cursor: "pointer" }}
                    color="gray.700"
                  >
                    <Td>
                      {stud.firstName} {stud.lastName}
                    </Td>
                    <Td>{stud.email}</Td>
                    <Td>
                      {classCount.find((elem) => elem.id === stud.id)?.count ?? 0}
                    </Td>
                    <Td>
                      <Button
                        backgroundColor="transparent"
                        onClick={(e) => {
                          e.stopPropagation(); // prevents earlier onclick
                        }}
                        m={-8} // overrides bounds of row
                        fontSize="28px"
                      >
                        <FiTrash2 />
                      </Button>
                    </Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
