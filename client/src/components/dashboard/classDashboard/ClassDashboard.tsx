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
import { LuFilter } from "react-icons/lu";
import { PiArrowsDownUpFill } from "react-icons/pi";
import { SlArrowLeft, SlArrowRight } from "react-icons/sl";
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
  const [pageNum, setPageNum] = useState<number>(0);
  const [classes, setClasses] = useState<Class[]>([]);
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classesResponse = await backend.get("/classes/scheduled");
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
      <HStack
        w="100%"
        pl={20}
      >
        <Input
          flex={4}
          h="36px"
          borderRadius="18px"
          placeholder="Search"
          disabled
        ></Input>
        <Box flex={1} />
        <HStack gap={0}>
          <Text>
            {pageNum * 10 + 1}
            {" - "}
            {pageNum * 10 + 10 < classes.length
              ? pageNum * 10 + 10
              : classes.length}
            {" of "}
            {classes.length}
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
                pageNum * 10 + 10 >= classes.length ? pageNum : pageNum + 1
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
              ? classes
                  .slice(pageNum * 10, pageNum * 10 + 10)
                  .map((cls, index) => (
                    <Tr
                      key={index}
                      onClick={() =>
                        navigate(`/dashboard/classes/${cls.id}/${cls.date}`)
                      }
                      backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                      _hover={{ bg: "gray.300", cursor: "pointer" }}
                      color="gray.700"
                    >
                      <Td fontFamily="Inter">{cls.title}</Td>
                      <Td fontFamily="Inter">{cls.teacher}</Td>
                      <Td fontFamily="Inter">{cls.level}</Td>
                      <Td fontFamily="Inter">{cls.date?.split("T")[0]}</Td>
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
