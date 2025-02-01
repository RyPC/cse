import { useEffect, useState } from "react";

import {
  Button,
  Link as ChakraLink,
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

import { Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { User } from "../../types/user";
import { RoleSelect } from "./RoleSelect";
import { Class } from "../../types/class";

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
      w="30%"
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
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [users, setUsers] = useState<User[] | undefined>();
  const [activeClasses, setActiveClasses] = useState<Class[] | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/users");
        setUsers(response.data);
        const activeClasses = await backend.get("/classes");
        setActiveClasses(activeClasses.data);
        console.log("activeClasses", activeClasses.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [backend]);

  return (
    <VStack
      spacing={8}
      sx={{ maxWidth: "100%", marginX: "auto" }}
    >
      <Heading>Dashboard</Heading>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="80%"
        direction={["row"]}
      >
        <StatCard
          icon="email"
          iconColor="blue.500"
          label="Total Students"
          value={users?.length || 0}
        />
        <StatCard
          icon="email"
          iconColor="blue.500"
          label="Attendance Rate"
          value={"5%"}
        />
        <StatCard
          icon="email"
          iconColor="blue.500"
          label="Active Classes"
          value={activeClasses?.length || 0}
        />
      </Flex>
      <VStack>
        <Text>
          Signed in as {currentUser?.email} (
          {role === "admin" ? "Admin" : "User"})
        </Text>

        {role === "admin" ? (
          <ChakraLink
            as={Link}
            to={"/admin"}
          >
            Go to Admin Page
          </ChakraLink>
        ) : null}
        <Button onClick={logout}>Sign out</Button>
      </VStack>

      <TableContainer
        sx={{
          overflowX: "auto",
        }}
      >
        <Table variant="simple">
          <TableCaption>Users</TableCaption>
          <Thead>
            <Tr>
              <Th>Id</Th>
              <Th>Email</Th>
              <Th>FirebaseUid</Th>
              <Th>Role</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users
              ? users.map((user, i) => (
                  <Tr key={i}>
                    <Td>{user.id}</Td>
                    <Td>{user.email}</Td>
                    <Td>{user.firebaseUid}</Td>
                    <Td>
                      <RoleSelect
                        user={user}
                        disabled={role !== "admin"}
                      />
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
