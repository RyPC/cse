import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Image,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { SlArrowLeft } from "react-icons/sl";
import { useNavigate, useParams } from "react-router-dom";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { DetailedClass } from "../../../types/scheduled_class";
import { NotificationPanel } from "../NotificationPanel";

function ClassInfoDashboard() {
  const navigate = useNavigate();
  const { classId } = useParams();
  const { backend } = useBackendContext();
  const [currentClass, setCurrentClass] = useState<DetailedClass | undefined>();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await backend.get(`/classes/joined/${classId}`);
        classesResponse.data[0].date = new Date(classesResponse.data[0].date);
        setCurrentClass(classesResponse.data[0]);
        // console.log(classesResponse.data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend, classId]);

  const hardcodedCoreqs = ["Ballet I", "Contemporary I"]; // Hardcoded coreqs for now

  return (
    <VStack gap="30px">
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
            onClick={() => navigate("/dashboard/students")}
          >
            <SlArrowLeft />
          </Button>
          {currentClass?.title}
        </Heading>
        <Image
          alignSelf={"flex-end"}
          cursor="pointer"
          onClick={onOpen}
          ref={notifRef}
          src="/bell.png"
        />
        <NotificationPanel
          isOpen={isOpen}
          onClose={onClose}
        />
      </Flex>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Title
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.title}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Location
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.location}
        </Box>
      </HStack>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Date
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.date.toLocaleDateString()}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Performances
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          TODO
        </Box>
      </HStack>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Start
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.startTime}
        </Box>
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          End
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.endTime}
        </Box>
      </HStack>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Level
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.level}
        </Box>
        <Box
          flex={2}
          fontWeight={700}
          pr="60px"
          fontSize={18}
        >
          Description
        </Box>
      </HStack>
      <HStack
        w="100%"
        pl="60px"
        pr="160px"
        gap="60px"
      >
        <Box
          flex={1}
          fontWeight={700}
          fontSize={18}
        >
          Capacity
        </Box>
        <Box
          flex={1}
          textAlign="right"
          fontSize={18}
        >
          {currentClass?.capacity}
        </Box>
        <Box
          flex={2}
          pr="60px"
          fontSize={18}
        >
          {currentClass?.description}
        </Box>
      </HStack>

      <Box
        w="100%"
        mt="80px"
        pl="40px"
      >
        <Text
          fontWeight={500}
          fontSize={24}
          pl="20px"
        >
          Check-in Log
        </Text>
        <AttendanceLogTable />
      </Box>
    </VStack>
  );
}
export default ClassInfoDashboard;

const AttendanceLogTable = () => {
  const sampleData = [
    {
      name: "John Doe",
      attended: "Yes",
      date: new Date("2025-01-15"),
      location: "Riverside",
      email: "thing.test@gmail.com",
    },
    {
      name: "Jane Smith",
      attended: "Yes",
      date: new Date("2025-01-15"),
      location: "Riverside",
      email: "thing.test@gmail.com",
    },
    {
      name: "Mike Johnson",
      attended: "Yes",
      date: new Date("2025-01-15"),
      location: "Riverside",
      email: "thing.test@gmail.com",
    },
  ];

  return (
    <Box p={4}>
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
              Name
            </Th>
            <Th
              fontFamily="Inter"
              fontWeight={700}
              color="#4A5568"
              letterSpacing="5%"
              fontSize={18}
              textTransform="none"
            >
              Attended
            </Th>
            <Th
              fontFamily="Inter"
              fontWeight={700}
              color="#4A5568"
              letterSpacing="5%"
              fontSize={18}
              textTransform="none"
            >
              Date
            </Th>
            <Th
              fontFamily="Inter"
              fontWeight={700}
              color="#4A5568"
              letterSpacing="5%"
              fontSize={18}
              textTransform="none"
            >
              Location
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
          </Tr>
        </Thead>
        <Tbody>
          {sampleData.map((record, index) => (
            <Tr
              key={index}
              backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
              _hover={{ bg: "gray.300", cursor: "pointer" }}
              color="gray.700"
            >
              <Td>{record.name}</Td>
              <Td>{record.attended}</Td>
              <Td>{record.date.toLocaleDateString()}</Td>
              <Td>{record.location}</Td>
              <Td>{record.email}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
