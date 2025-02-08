import { useEffect, useRef, useState } from "react";

import {
  Flex,
  Heading,
  Image,
  Table,
  TableCaption,
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

import { Outlet, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { Class } from "../../../types/class";
import { NotificationPanel } from "../NotificationPanel";

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();

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
      <Flex w={"100%"} justify={"space-between"}>
        <Heading
          as="h1"
          size="lg"
          mb={4}
          alignSelf={"flex-start"}
        >
          Classes
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
      <TableContainer
        w="100%"
        sx={{
          overflowX: "auto",
        }}
      >
        <Table
          variant="simple"
          colorScheme="black"
          size="lg"
          sx={{}}
        >
          <TableCaption>All Classes</TableCaption>
          <Thead>
            <Tr>
              <Th
                fontWeight={"bold"}
                color={"black"}
              >
                Class Title
              </Th>
              <Th>Description</Th>
              <Th>Level</Th>
              <Th>Location</Th>
              <Th>Capacity</Th>
              <Th>Costume</Th>
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
                    <Td>{cls.level}</Td>

                    <Td>{cls.location}</Td>
                    <Td>{cls.capacity}</Td>
                    <Td>{cls.costume}</Td>
                    {/* <Td>{cls.teacher}</Td> */}
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
