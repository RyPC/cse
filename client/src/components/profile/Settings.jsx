import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { Navbar } from "../navbar/Navbar";

export const Settings = () => {
  const { currentUser, role } = useAuthContext();

  const hardcodedProfilePic =
    "https://d1ef7ke0x2i9g8.cloudfront.net/hong-kong/_large700/2143830/LC-Sign-Tony-interview-Big-Hitter-header.webp";
  const hardcodedName = currentUser?.displayName
    ? `${currentUser.displayName}`
    : "First Last";

    return (
    <Box>
      <Center>
      <Flex
        direction="column"
        align="center"
        height="80vh"
        padding={4}
        mt={10}
        w={"100%"}
      >
        <Heading
          size="lg"
          mb={4}
        >
          Account Details
        </Heading>
        <Image
          borderRadius="full"
          boxSize="150px"
          src={hardcodedProfilePic}
          alt="Profile"
          mb={4}
        />

        <Flex
          direction="row"
          height="40%"
          width="100%"
        >
          <Flex
            direction="column"
            padding={2}
            width="50%"
            justify="space-between"
            mt={4}
          >
            <Text>Name</Text>
            <Text>Role</Text>
            {/* <Text>ID Number</Text> */}
            <Text>Email</Text>
            <Text>Password</Text>
          </Flex>

          <Flex
            direction="column"
            padding={2}
            width="50%"
            justify="space-between"
            mt={4}
          >
            <Text>{hardcodedName}</Text>
            <Text>{role || "Not available"}</Text>
            {/* <Text>{currentUser?.uid || "Not available"}</Text> */}
            <Text>{currentUser?.email || "Not available"}</Text>
            <Flex
              direction="row"
              justify="space-between"
              align="center"
            >
              <Text><a href="/forgotPassword">Change Password</a></Text>
              <Button
                variant="plain"
                size="xs"
                onClick={() =>
                  window.location.assign("/forgotPassword")
                }
              >
                <Image
                  src="../Vector.png"
                  alt="Profile"
                  mt={1}
                />
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      </Center>
      <Navbar></Navbar>
    </Box>
  );
};
