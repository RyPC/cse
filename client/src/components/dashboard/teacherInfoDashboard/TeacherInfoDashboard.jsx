import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { VStack, Heading, Text } from '@chakra-ui/react';
import { useBackendContext } from '../../../contexts/hooks/useBackendContext.ts';
import { useState } from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
  } from '@chakra-ui/react'

const TeacherInfoDashboard = () => {

    const [data, setData] = useState();

    const { backend } = useBackendContext();

    useEffect(() => {
        const getTeacher = async () => {
            const data = await backend.get(`/teachers/join/${id}`);
            setData(data.data);
            console.log(data.data);
        }

        getTeacher();

    }, []);

    const { id } = useParams();

    return(
        <>
        <Heading as='h1'>Teacher Name</Heading>
        <div>
            <Text>Name</Text>
            <Text>ExampleName</Text>
            <Text>Email</Text>
            <Text>example@gmail.com</Text>
        </div>
        <Heading as='h2' size="sm">Associated Classes</Heading>
        
        {!data ? <p>Loading data...</p> : 
            <TableContainer>
                <Table variant="simple">
                    <TableCaption>All classes taught by TEACHER NAME</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Teacher</Th>
                            <Th>Level</Th>
                            <Th>Students</Th>
                            <Th>Status</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {

                        data.map((cls) => {
                            return(
                                <Tr>
                                    <Td>{cls.firstName} {cls.lastName}</Td>
                                    <Td>{cls.level}</Td>
                                    <Td>Test</Td>
                                    {/* Add in Aditya's component */}
                                    <Td>{cls.isActivated ? "verified" : "unverified"}</Td>
                                </Tr>
                            )  
                        })
                        
                        }
                    </Tbody>
                </Table>
            </TableContainer>
        }
        </>
    )
};

export default TeacherInfoDashboard;