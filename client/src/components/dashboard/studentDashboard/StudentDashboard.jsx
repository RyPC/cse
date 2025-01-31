import { Image, Link, Table, TableContainer, Tbody, Td, Th, Thead, Stack, Flex, Box, Tr, Heading} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useBackendContext } from "../../../contexts/hooks/useBackendContext";

export const StudentDashboard = () => {
    const { backend } = useBackendContext();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await backend.get("/students");
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
    
        fetchData();
    }, [backend]);
    

    return (
        <Stack mx="10%" my={5}>
            <Flex direction="row" justify="flex-end">
                <Image 
                    src="../bell.png"
                />
            </Flex>
            <Heading my={5}>Students</Heading>
            <TableContainer 
                sx={{
                    overflowX: "auto",
                }}
            >
                <Table variant="simple">
                    <Thead>
                        <Tr>
                        <Th>Id</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Level</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {students
                        ? students.map((stud, i) => (
                            <Tr key={i}>
                                <Td>{stud.id}</Td>
                                <Td>
                                    <Link
                                        href={`/dashboard/students/${stud.id}`}
                                    >   
                                        {stud.firstName} {stud.lastName}
                                    </Link>
                                </Td>
                                <Td>{stud.email}</Td>
                                <Td>{stud.level}</Td>
                            </Tr>
                            ))
                        : null}
                    </Tbody>
                </Table>
            </TableContainer>
        </Stack>
    );
};
