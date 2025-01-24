import { Box, Text } from "@chakra-ui/react";

import { Image, Center } from "@chakra-ui/react"
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { Flex } from "@chakra-ui/react"
import { Button } from "@chakra-ui/react";

export const Playground = () => {

  const { logout, currentUser } = useAuthContext();
  const { role } = useRoleContext();

  console.log(currentUser)

  return (
    <Box>
      <Center>
        <Image
          src="https://bit.ly/naruto-sage"
          boxSize="250px"
          borderRadius="full"
          fit="cover"
          alt="Naruto Uzumaki"
        />
      </Center>

      <Center>
        <br />
        <Text>
          Signed in as {currentUser?.email} <br />
        </Text>
      </Center>

      <Center>
        Your role is: {role === "admin" ? "Admin" : "User"}
      </Center>

      <Center>
        ID: {currentUser?.uid}
      </Center>

      <br /> <br />

      <Center>
        <Button>Donation PLS!</Button>
      </Center>
    </Box>
  );
};
