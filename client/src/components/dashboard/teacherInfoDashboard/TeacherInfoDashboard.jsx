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
import { Skeleton, SkeletonText, SkeletonCircle, Center } from '@chakra-ui/react';
import { Box } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons'

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

    return !data ? 
        <Center>
            {/* <SkeletonCircle size='10' /> */}
            <SkeletonText mt="10" width={"70%"} noOfLines={Math.floor(window.innerHeight / 50)} spacing='4' skeletonHeight='3'/>
        </Center>
    : (
        <>
        <Heading as='h1'>{data[0].firstName + data[0].lastName}</Heading>
        <div>
            <Text>Name</Text>
            <Text>{data[0].firstName + data[0].lastName}</Text>
            <Text>Email</Text>
            <Text>{data[0].email}</Text>
        </div>
        <Heading mt="20" as='h2' size="md">Associated Classes</Heading>
         
        <TableContainer mt="5">
            <Table variant="simple">
                <TableCaption>All classes taught by {data[0].firstName + data[0].lastName}</TableCaption>
                <Thead>
                    <Tr>
                        <Th>Class</Th>
                        <Th>Teacher</Th>
                        <Th>Level</Th>
                        <Th>Students</Th>
                        <Th>Status</Th>
                        <Th></Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {

                    data.map((cls) => {
                        return(
                            <Tr>
                                <Td>{cls.title}</Td>
                                <Td>{cls.firstName}{cls.lastName}</Td>
                                <Td>{cls.level}</Td>
                                <Td>Test</Td>
                                {/* Add in Aditya's component */}
                                <Td>{cls.isActivated ? "verified" : "unverified"}</Td>
                                <Td><DeleteIcon/></Td>
                            </Tr>
                        )  
                    })
                    
                    }
                </Tbody>
            </Table>
        </TableContainer>
        </>
    )
};

export default TeacherInfoDashboard;