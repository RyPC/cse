import { Button, Flex, Heading, Image, Text, VStack, Box } from "@chakra-ui/react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { Navbar } from "../navbar/Navbar";

export const Settings = () => {
  const { currentUser } = useAuthContext();

  const hardcodedProfilePic =
    "https://d1ef7ke0x2i9g8.cloudfront.net/hong-kong/_large700/2143830/LC-Sign-Tony-interview-Big-Hitter-header.webp";
  const hardcodedName =
    currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : "First Last";

  return (
    <Box>
    <Flex
        direction="column"
        align="center"
        height="80vh"
        padding={4}
        mt={10}
    >
        <Heading size="lg" mb={4}>Account Details</Heading>
        <Image
        borderRadius="full"
        boxSize="150px"
        src={hardcodedProfilePic}
        alt="Profile"
        mb={4}
        />

        <Flex
            direction="row"
            height="50%"
            width="100%"
        >
            <Flex
                direction="column"
                padding={2}
                width="50%"
                justify="space-between"
            >
                <Text>Name</Text>
                <Text>Role</Text>
                <Text>Student Number</Text>
                <Text>Phone Number</Text>
                <Text>Email</Text>
                <Text>Password</Text>
            </Flex>

            <Flex
                direction="column"
                padding={2}
                width="50%"
                justify="space-between"
            >
                <Text>{hardcodedName}</Text>
                <Text>{currentUser?.user_role || "Not available"}</Text>
                <Text>1234567</Text>
                <Text>123-456-7890</Text>
                <Text>{currentUser?.email || "Not available"}</Text>
                <Text>Change Password button</Text>
            </Flex>

        </Flex>
    </Flex>
    <Navbar></Navbar>
    </Box>
  );
};
