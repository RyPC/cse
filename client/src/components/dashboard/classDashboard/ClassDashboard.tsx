import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
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

import { FiTrash2 } from "react-icons/fi";
import { SlArrowLeft } from "react-icons/sl";
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
          Classes and Events
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
          {/* <TableCaption>All Classes</TableCaption> */}
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
                Class
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Teacher
              </Th>
              <Th
                fontFamily="Inter"
                fontWeight={700}
                color="#4A5568"
                letterSpacing="5%"
                fontSize={18}
                textTransform="none"
              >
                Level
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
            </Tr>
          </Thead>
          <Tbody>
            {classes
              ? classes.map((cls, index) => (
                  <Tr
                    key={cls.id}
                    onClick={() => navigate(`/dashboard/classes/${cls.id}`)}
                    backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                    _hover={{ bg: "gray.300", cursor: "pointer" }}
                  >
                    <Td fontFamily="Inter">{cls.title}</Td>
                    <Td fontFamily="Inter">{cls.teacher}</Td>
                    <Td fontFamily="Inter">{cls.level}</Td>
                    <Td fontFamily="Inter">{cls.date}</Td>
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
      <VStack>
        <Text>
          Signed in as {currentUser?.email} (
          {role === "admin" ? "Admin" : "User"})
        </Text>
      </VStack>
    </VStack>
  );
}
