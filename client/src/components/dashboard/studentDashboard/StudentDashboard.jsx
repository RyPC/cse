import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { FiTrash2 } from "react-icons/fi";
import { LuFilter } from "react-icons/lu";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
import { useNavigate } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { NotificationPanel } from "../NotificationPanel";

export const StudentDashboard = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { notifRef } = useRef();
  const navigate = useNavigate();
  const { backend } = useBackendContext();
  const [pageNum, setPageNum] = useState(0);
  const [students, setStudents] = useState([]);
  const [classCount, setClassCount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/students");
        setStudents(response.data);

        const countResponse = await backend.get(
          "/class-enrollments/student-class-count"
        );
        setClassCount(countResponse.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchData();
  }, [backend]);

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await backend.get("/students", {
        params: { search: searchTerm },
      });
      setStudents(response.data);
    } catch (error) {
      console.error("Error searching students:", error);
    }
  };

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
      <form
        onSubmit={handleSearch}
        style={{ width: "100%" }}
      >
        <HStack
          w="100%"
          pl={20}
        >
          <Input
            flex={4}
            h="36px"
            borderRadius="18px"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          ></Input>
          <Box flex={1} />
          <HStack gap={0}>
            <Text>
              {pageNum * 10 + 1}
              {" - "}
              {pageNum * 10 + 10 < students.length
                ? pageNum * 10 + 10
                : students.length}
              {" of "}
              {students.length}
            </Text>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={() => setPageNum(pageNum <= 0 ? pageNum : pageNum - 1)}
            >
              <SlArrowLeft />
            </Button>
            <Button
              backgroundColor="transparent"
              p={0}
              onClick={() =>
                setPageNum(
                  pageNum * 10 + 10 >= students.length ? pageNum : pageNum + 1
                )
              }
            >
              <SlArrowRight />
            </Button>
            <Text>|</Text>
            <Button
              backgroundColor="transparent"
              p={0}
            >
              <LuFilter />
            </Button>
            <Text>|</Text>
            <Button
              backgroundColor="transparent"
              p={0}
            >
              <PiArrowsDownUpFill />
            </Button>
          </HStack>
        </HStack>
      </form>
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
              ? students
                  .slice(pageNum * 10, pageNum * 10 + 10)
                  .map((stud, index) => (
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
                        {classCount.find((elem) => elem.id === stud.id)
                          ?.count ?? 0}
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
