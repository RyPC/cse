import {
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { L } from "../logout/Logout";
import { Navbar } from "../navbar/Navbar";

export const Profile = () => {
  const { currentUser } = useAuthContext();

  const hardcodedProfilePic =
    "https://d1ef7ke0x2i9g8.cloudfront.net/hong-kong/_large700/2143830/LC-Sign-Tony-interview-Big-Hitter-header.webp";
  const hardcodedName =
    currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : "Homie Tony";

  return (
    <Box>
      <Flex
        direction="column"
        align="center"
        justify="center"
        height="100vh"
        padding={4}
      >
        <Image
          borderRadius="full"
          boxSize="150px"
          src={hardcodedProfilePic}
          fit="cover"
          mb={4}
          alt="Profile"
        />
        <Heading
          fontSize="20px"
          fontWeight="600"
        >
          {hardcodedName}
        </Heading>
        <Text>{currentUser?.email || "Not available"}</Text>
        <Text>Role: {currentUser?.user_role || "Not available"}</Text>

        <VStack
          spacing={4}
          mt={10}
          // w={"80"}
        >
          <Button
            onClick={() =>
              console.log("Redirect to GoFundMe to be implemented")
            }
            as="a"
            href="https://ctc-uci.com/"
            target="_blank"
            borderRadius="5px"
            color="white"
            bg="#422E8D"
            height="6.407vh"
            // width calculated from figma hi-fi
            w="82.33vw"
          >
            <Text fontSize="16px">Donations</Text>
          </Button>
          <Button
            onClick={() => console.log("Settings opened!")}
            colorScheme="gray"
            borderRadius="5px"
            color="white"
            bg="#422E8D"
            height="6.407vh"
            // width calculated from figma hi-fi
            w="82.33vw"
          >
            <a href="/settings">Settings</a>
          </Button>
          <L />
        </VStack>
      </Flex>
      <Navbar></Navbar>
    </Box>
  );
};
