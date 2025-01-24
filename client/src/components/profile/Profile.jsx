import { Button, Flex, Heading, Image, Text, VStack } from "@chakra-ui/react";
import { useAuthContext } from "../../contexts/hooks/useAuthContext";

export const Profile = () => {
  const { currentUser } = useAuthContext();

  const hardcodedProfilePic =
    "https://d1ef7ke0x2i9g8.cloudfront.net/hong-kong/_large700/2143830/LC-Sign-Tony-interview-Big-Hitter-header.webp";
  const hardcodedName =
    currentUser?.first_name && currentUser?.last_name
      ? `${currentUser.first_name} ${currentUser.last_name}`
      : "Homie Tony";

  return (
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
        alt="Profile"
        mb={4}
      />
      <Heading size="lg">{hardcodedName}</Heading>
      <Text>Email: {currentUser?.email || "Not available"}</Text>
      <Text>Role: {currentUser?.user_role || "Not available"}</Text>

      <VStack
        spacing={4}
        mt={6}
      >
        <Button
          as="a"
          href="https://ctc-uci.com/"
          target="_blank"
          colorScheme="blue"
        >
          Donation
        </Button>
        <Button
          onClick={() => console.log("Settings opened!")}
          colorScheme="gray"
        >
          Settings
        </Button>
      </VStack>
    </Flex>
  );
};
