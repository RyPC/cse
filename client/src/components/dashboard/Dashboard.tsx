import { useEffect, useState } from "react";

import {
  Box,
  Flex,
  Heading,
  Icon,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { Class } from "../../types/class";
import { User } from "../../types/user";

interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export const StatCard = ({ icon, iconColor, label, value }: StatCardProps) => {
  return (
    <Flex
      bg="gray.100"
      p={4}
      borderRadius="md"
      shadow="md"
      direction="row"
      align="center"
      w={["100%", "30%"]} // Responsive width
      mb={[4, 0]} // Margin bottom for mobile
    >
      <Icon
        as="circle"
        boxSize="50px"
        color={iconColor}
        mr={4}
      />
      <Flex direction="column">
        <Text color="black">{label}</Text>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="black"
        >
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};

export const Dashboard = () => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [users, setUsers] = useState<User[] | undefined>();
  const [classes, setClasses] = useState<Class[] | undefined>();
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await backend.get("/users");
        setUsers(usersResponse.data);

        const classesResponse = await backend.get("/classes");
        setClasses(classesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend]);

  return (
    <VStack
      spacing={8}
      sx={{ maxWidth: "100%", marginX: "auto", padding: 4 }}
    >
      <Heading>Dashboard</Heading>

      {/* Stat Cards */}
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        direction={["column", "row"]} // Column for mobile, row for larger screens
        gap={4}
      >
        <StatCard
          icon="email"
          iconColor="blue.500"
          label="Total Students"
          value={users?.length || 0}
        />
        <StatCard
          icon="email"
          iconColor="green.500"
          label="Attendance Rate"
          value={"15%"}
        />
        <StatCard
          icon="email"
          iconColor="purple.500"
          label="Total Classes"
          value={classes?.length || 0}
        />
      </Flex>

      {/* Graph Placeholder */}
      <Box
        bg="gray.100"
        w="100%"
        h="200px"
        borderRadius="md"
        display="flex"
        position={"relative"}
        alignItems="center"
        justifyContent="center"
      >
        <Text color="gray.500">Graph Placeholder</Text>
        <Box
          position="absolute"
          top="4"
          right="4"
        >
          <Flex
            bg="white"
            borderRadius="full"
            border="1px"
            borderColor="gray.200"
            p={1}
            shadow="sm"
          >
            {["day", "week", "month"].map((period) => (
              <Box
                key={period}
                px={3}
                py={1}
                cursor="pointer"
                borderRadius="full"
                bg={selectedPeriod === period ? "blue.500" : "transparent"}
                color={selectedPeriod === period ? "white" : "gray.600"}
                onClick={() => setSelectedPeriod(period)}
                _hover={{
                  bg: selectedPeriod === period ? "blue.600" : "gray.100",
                }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Box>
            ))}
          </Flex>
        </Box>
      </Box>

      {/* Classes Table */}
      <TableContainer
        w="100%"
        sx={{
          overflowX: "auto",
        }}
      >
        <Table variant="simple">
          <TableCaption>All Classes</TableCaption>
          <Thead>
            <Tr>
              <Th>Class Title</Th>
              <Th>Description</Th>
              <Th>Location</Th>
              <Th>Capacity</Th>
              <Th>Costume</Th>
              <Th>Level</Th>
            </Tr>
          </Thead>
          <Tbody>
            {classes
              ? classes.map((cls) => (
                  <Tr key={cls.id}>
                    <Td>{cls.title}</Td>
                    <Td>{cls.description}</Td>
                    <Td>{cls.location}</Td>
                    <Td>{cls.capacity}</Td>
                    <Td>{cls.costume}</Td>
                    <Td>{cls.level}</Td>
                  </Tr>
                ))
              : null}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Signed-in User Info */}
      <VStack>
        <Text>
          Signed in as {currentUser?.email} (
          {role === "admin" ? "Admin" : "User"})
        </Text>
      </VStack>
    </VStack>
  );
};
