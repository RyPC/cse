import { useEffect, useState } from "react";

import {
  Flex,
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

import { Outlet, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { Class } from "../../../types/class";

function ClassDashboard() {
  return <Outlet />;
}

export default ClassDashboard;

export function OverallClassDashboard() {
  const [classes, setClasses] = useState<Class[] | undefined>();
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await backend.get("/classes");
        setClasses(classesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend]);
  return (
    <VStack>
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
                  <Tr
                    key={cls.id}
                    onClick={() => navigate(`/dashboard/classes/${cls.id}`)}
                    _hover={{ bg: "gray.500", cursor: "pointer" }}
                  >
                    <Td fontWeight="bold">{cls.title}</Td>
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
      <VStack>
        <Text>
          Signed in as {currentUser?.email} (
          {role === "admin" ? "Admin" : "User"})
        </Text>
      </VStack>
    </VStack>
  );
}
