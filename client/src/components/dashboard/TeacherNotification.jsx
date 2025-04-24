import { Button, Text, Stack, Box, Flex, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const TeacherNotification = ({id, firstName, lastName}) => {
    const { backend } = useBackendContext();
    const toast = useToast();

    const handleApprove = async (id) => {
        console.log("Approved teacher with id ", id);
        try {
            await backend.put(`/teachers/${id}`,  {
                isActivated: true
            });
            toast({
                title: "Teacher request approved.",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating teacher's activation status: ", error);
        }
    };

    const handleDecline = async (id) => {
        console.log("Declined teacher with id ", id);
        try {
            await backend.put('/users/hide',  {
                uid: id
            });
            toast({
                title: "Teacher request denied.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error updating teacher's activation status: ", error);
        }
    };
    
    return (
        <Box
            h="140px"
            w="300px"
            p="2"
            shadow="md"
        >
            <Stack>
                <Flex
                    direction="column"
                    align="left"
                    p="3"
                >
                    <Text
                        fontWeight="bold"
                    >
                        New Teacher:
                    </Text>
                    <Text>
                        {firstName} {lastName}
                    </Text>
                </Flex>

                <Flex
                    direction="row"
                    align="center"
                    justify="center"
                >
                    <Button
                        width="50%"
                        onClick={() => handleDecline(id)}
                    >
                        Deny
                    </Button>
                    <Button
                        bg="#422E8D"
                        color="white"
                        width="50%"
                        _hover={{bg: "#2a1c5e"}}
                        
                        onClick={() => handleApprove(id)}
                    >
                        Approve
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
};