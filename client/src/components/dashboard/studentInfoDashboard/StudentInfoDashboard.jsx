import { Image, Table, TableContainer, Tbody, Td, Th, Thead, Stack, Flex, Box, Tr, Heading, useDisclosure} from "@chakra-ui/react";

import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useBackendContext } from "../../../contexts/hooks/useBackendContext";
import { NotificationPanel } from "../NotificationPanel";

export const StudentInfoDashboard = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { notifRef } = useRef();
    const { backend } = useBackendContext();
    
    const { id } = useParams(); // must have the same name as url parameter
    const [ students, setStudents ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await backend.get(`/students/joined/${id}`);
                console.log("Fetched results:", response.data);
                setStudents(response.data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };
    
        fetchData();
    }, [backend, id]);
    
    return (
        <Stack mx="10%" my={5}>
            <Flex direction="row" justify="flex-end">
                <Image 
                    src="../../../../bell.png"
                    onClick={onOpen}
                    ref={notifRef}
                />                
            </Flex>
            <NotificationPanel isOpen={isOpen} onClose={onClose} />

            {students.length !== 0 ? 
                <Box my={5}>
                    <Heading >{students[0].firstName} {students[0].lastName}</Heading> 
                    <Heading size="md" fontWeight="normal">{students[0].email}</Heading>
                </Box>
            : <Heading>Student is not enrolled in any classes</Heading>}
            
            <TableContainer 
                sx={{
                    overflowX: "auto",
                }}
            >
                <Table variant="simple">
                    <Thead>
                        <Tr>
                        <Th>Class</Th>
                        <Th>Description</Th>
                        <Th>Level</Th>
                        <Th>Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {students.length !== 0 ? students.map((stud, i) => (
                            <Tr key={i}>
                                <Td>{stud.title}</Td>
                                <Td>{stud.description}</Td>
                                <Td>{stud.level}</Td>
                                <Td>{stud.attendance}</Td>
                            </Tr>
                            ))
                        : null}
                    </Tbody>
                </Table>
            </TableContainer>
        </Stack>
    );
};