import { useEffect, useRef, useState } from "react";

import {
  Button,
  Link as ChakraLink,
  Flex,
  Heading,
  HStack,
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

import { Link, useParams } from "react-router-dom";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { LevelCard } from "../../resources/LevelCard";
import { StatusCard } from "../../resources/StatusCard";
import { NavigationSidebar } from "../NavigationSidebar";
import { NotificationPanel } from "../NotificationPanel";
import { RoleSelect } from "../RoleSelect";

export const TeacherInfoDashboard = () => {
  const { teacherId } = useParams();
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();
  const notifRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [classStudents, setClassStudents] = useState(new Map());
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/teachers/" + teacherId);
        setTeacher(response.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
      try {
        const response = await backend.get(
          "/classes/students/teacher/" + teacherId
        );
        setClassStudents(
          response.data.reduce((acc, item) => {
            const {
              classId,
              studentId,
              title,
              classLevel,
              capacity,
              isDraft,
              firstName,
              lastName,
            } = item;
            const key = JSON.stringify({
              id: classId,
              title,
              level: classLevel,
              capacity,
              isDraft,
            }); // class
            const value = { id: studentId, firstName, lastName }; // student + user
            if (!acc.has(key))
              if (studentId) acc.set(key, [value]);
              else acc.set(key, []);
            else acc.get(key).push(value);
            return acc;
          }, new Map())
        );
      } catch (error) {
        console.error(
          "Error fetching classes and students for teacher:",
          error
        );
      }
    };

    fetchData();
  }, [backend]);

  return (
    <HStack alignItems={"flex-start"}>
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto", marginTop: "30px" }}
      >
        <Flex
          direction="row"
          w={"100%"}
          justify={"space-between"}
        >
          <Heading alignSelf={"flex-start"}>
            {teacher?.firstName} {teacher?.lastName}
          </Heading>
          <Image
            alignSelf={"flex-end"}
            cursor="pointer"
            onClick={onOpen}
            ref={notifRef}
            src="/bell.png"
          />
        </Flex>
        <NotificationPanel
          isOpen={isOpen}
          onClose={onClose}
        />
        <Text>Email: {teacher?.email}</Text>
        <Text>
          Verified: <StatusCard status={teacher?.isActivated} />
        </Text>

        <VStack>
          <Text>
            Signed in as {currentUser?.email} (
            {role === "admin" ? "Admin" : "Teacher"})
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
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Level</Th>
                <Th>Capacity</Th>
                <Th>Students</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {classStudents
                ? [...classStudents].map(([classString, students], i) => {
                    const cls = JSON.parse(classString);
                    return (
                      <Tr key={i}>
                        <Td>{cls.title}</Td>
                        <Td>
                          <LevelCard level={cls.level} />
                        </Td>
                        <Td>{cls.capacity}</Td>
                        <Td>
                          <VStack>
                            {students.map((stu, j) => (
                              <Text key={j}>
                                {stu.firstName} {stu.lastName}
                              </Text>
                            ))}
                          </VStack>
                        </Td>
                        <Td>
                          <StatusCard status={cls.isDraft} />
                        </Td>
                      </Tr>
                    );
                  })
                : null}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
    </HStack>
  );
};
