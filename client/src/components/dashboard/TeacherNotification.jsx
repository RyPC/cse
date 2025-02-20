import { Button, Text, Stack, Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";

export const TeacherNotification = ({id, firstName, lastName}) => {
    const { backend } = useBackendContext();

    const handleApprove = async (id) => {
        console.log("Approved teacher with id ", id);
        try {
            await backend.put(`/teachers/${id}`,  {
                isActivated: true
            });
            alert("Successfully approved teacher");
            // delete above alert later, just so testing devs know something happened
        } catch (error) {
            console.error("Error updating teacher's activation status: ", error);
        }
    };

    const handleDecline = (id) => {
        // for now, leave this task to be implemented later
    };
    
    return (
        <Box
            h="140px"
            w="300px"
            borderWidth="1px"
            p="2"
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
                        Decline
                    </Button>
                    <Button
                        bg="gray.500"
                        color="white"
                        width="50%"
                        onClick={() => handleApprove(id)}
                    >
                        Approve
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
};