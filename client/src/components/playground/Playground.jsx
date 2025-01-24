import { useEffect, useState } from "react";
import { Box, Flex } from "@chakra-ui/react";

import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { ClassCard } from "../shared/ClassCard";


import { Image, Center } from "@chakra-ui/react"
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { Flex } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react";

export const Playground = () => {

  const { logout, currentUser } = useAuthContext();
  const { role } = useRoleContext();

  console.log(currentUser)

  // return (
  //   <Box>
  //     <Center>
  //       <Image
  //         src="https://bit.ly/naruto-sage"
  //         boxSize="250px"
  //         borderRadius="full"
  //         fit="cover"
  //         alt="Naruto Uzumaki"
  //       />
  //     </Center>

  //     <Center>
  //       <br />
  //       <Text>
  //         Signed in as {currentUser?.email} <br />
  //       </Text>
  //     </Center>

  //     <Center>
  //       Your role is: {role === "admin" ? "Admin" : "User"}
  //     </Center>

  //     <Center>
  //       ID: {currentUser?.uid}
  //     </Center>

  //     <br /> <br />

  //     <Center>
  //       <Button>Donation PLS!</Button>
  //     </Center>
  //   </Box>
  // );
    const { backend } = useBackendContext();

    const [classes, setClasses] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch and Store Classes Information
            try {
                const response = await backend.get("/classes");
                setClasses(response.data);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }

            // Fetch and Store Events Information
            try {
                const response = await backend.get("/events");
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchData();
    }, [backend]);

    return (
        <Box>
            <Flex align="center" justify="center" gap={5} wrap="wrap">
                {classes.map((classItem, index) => (
                    <ClassCard
                        key={index}
                        title={classItem.title}
                        description={classItem.description}
                        location={classItem.location}
                        capacity={classItem.capacity}
                        level={classItem.level}
                        costume={classItem.costume}
                    />
                ))}

                {events.map((eventItem, index) => (
                    // Your event card component and its props!
                    <></> // here to avoid errors
                ))}
            </Flex>
        </Box>
    );
};
