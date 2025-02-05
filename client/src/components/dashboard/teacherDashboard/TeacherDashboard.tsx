import { useEffect, useState } from "react";

import {
  Badge,
  Button,
  Link as ChakraLink,
  Heading,
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

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../../contexts/hooks/useRoleContext";
import { RoleSelect } from "../RoleSelect";

export const TeacherDashboard = () => {
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [classesTaught, setClassesTaught] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await backend.get("/teachers");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
      try {
        const response = await backend.get("/classes");
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
      try {
        const response = await backend.get("/classes-taught");
        setClassesTaught(
          response.data.reduce((acc, item) => {
            if (!acc[item.teacherId]) acc[item.teacherId] = [item.classId];
            else acc[item.teacherId].push(item.classId);
            return acc;
          }, {})
        );
      } catch (error) {
        console.error("Error fetching classes taught:", error);
      }

    };

    fetchData();
  }, [backend]);

  useEffect(() => {
    // console.log(teachers)
    // console.log(classes)
    // console.log(classesTaught)
  }, [teachers, classes, classesTaught])

  return (
    <VStack
      spacing={8}
      sx={{ maxWidth: "100%", marginX: "auto" }}
    >
      <Heading>Teachers</Heading>

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
          <TableCaption>Teachers</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Classes</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {teachers
              ? teachers.map((teacher, i) => (
                  <Tr key={i} onClick={() => { window.location.href='/dashboard/teachers/'+teacher.id }}>
                    <Td>{teacher.firstName} {teacher.lastName}</Td>
                    <Td>{teacher.email}</Td>
                    <Td>
                        <VStack>
                        {classesTaught[teacher.id] && 
                            classesTaught[teacher.id].map((class_id, j) => (
                                <Text key={j}>{
                                    classes.find(cls => class_id === cls.id)?.title
                                }</Text>
                            )) 
                         }
                        </VStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={teacher.isActivated ? 'green' : 'yellow'}>
                          {teacher.isActivated ? 'verified' : 'unverified'}
                      </Badge>
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

