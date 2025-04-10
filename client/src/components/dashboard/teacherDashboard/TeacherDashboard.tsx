import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Link as ChakraLink,
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
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { StatusCard } from "../../resources/StatusCard";
import { NotificationPanel } from "../NotificationPanel";
import { RoleSelect } from "../RoleSelect";

export const TeacherDashboard = () => {
  const { currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const navigate = useNavigate();

  const [pageNum, setPageNum] = useState<number>(0);
  const [teacherClasses, setTeacherClasses] = useState(new Map());
  const notifRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/teachers/classes/");
        // console.log(response.data);
        setTeacherClasses(
          response.data.reduce((acc, item) => {
            const {
              teacherId,
              classId,
              firstName,
              lastName,
              email,
              isActivated,
              title,
            } = item;
            const key = JSON.stringify({
              id: teacherId,
              firstName,
              lastName,
              email,
              isActivated,
            }); // teacher + user
            // console.log(key);
            const value = { id: classId, title }; // class
            if (!acc.has(key))
              if (classId) acc.set(key, [value]);
              else acc.set(key, []);
            else acc.get(key).push(value);
            return acc;
          }, new Map())
        );
      } catch (error) {
        console.error("Error fetching teachers and classes:", error);
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
          Teachers
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
            {pageNum * 10 + 10 < [...teacherClasses].length
              ? pageNum * 10 + 10
              : [...teacherClasses].length}
            {" of "}
            {[...teacherClasses].length}
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
                pageNum * 10 + 10 >= [...teacherClasses].length
                  ? pageNum
                  : pageNum + 1
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
                Status
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
            {teacherClasses
              ? [...teacherClasses]
                  .slice(pageNum * 10, pageNum * 10 + 10)
                  .map(([teacherString, classes], index) => {
                    const teacher = JSON.parse(teacherString);
                    return (
                      <Tr
                        key={teacher.id}
                        onClick={() =>
                          navigate(`/dashboard/teachers/${teacher.id}`)
                        }
                        backgroundColor={index % 2 ? "white" : "gray.100"} // Striped row backgrounds
                        _hover={{ bg: "gray.300", cursor: "pointer" }}
                        color="gray.700"
                      >
                        <Td>
                          {teacher.firstName} {teacher.lastName}
                        </Td>
                        <Td>{teacher.email}</Td>
                        <Td>
                          <StatusCard status={teacher.isActivated} />
                        </Td>
                        <Td>{classes.length}</Td>
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
                    );
                  })
              : null}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};
