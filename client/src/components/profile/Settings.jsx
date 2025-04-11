import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { Navbar } from "../navbar/Navbar";
import arrowImage from "./arrow.svg";

export const Settings = () => {
  const { currentUser, role } = useAuthContext();

  const hardcodedProfilePic =
    "https://d1ef7ke0x2i9g8.cloudfront.net/hong-kong/_large700/2143830/LC-Sign-Tony-interview-Big-Hitter-header.webp";
  const hardcodedName = currentUser?.displayName
    ? `${currentUser.displayName}`
    : "First Last";

  return (
    <>
      <Center h="90vh">
        <VStack>
          <Center>
            <VStack>
              <Heading
                fontSize="28px"
                fontWeight="500"
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
                fit="cover"
              />
            </VStack>
          </Center>

          <Center>
            <SimpleGrid
              maxW="80vw"
              columns={2}
              spacing="40px"
            >
              <Text>Name</Text>
              <Text>{currentUser?.displayName || "Not Available"}</Text>
              <Text>Role</Text>
              <Text>{role}</Text>
              <Text>Student Number</Text>
              <Text>{currentUser?.uid || "Not available"}</Text>
              <Text>Email</Text>
              <Text>{currentUser?.email || "Not available"}</Text>
              <Text>Password</Text>
              <Button
                // sx={{ border: "1px solid red" }}
                variant="plain"
                size="xs"
                onClick={() =>
                  console.log("Change password functionality to be implemented")
                }
              >
                {/* <Flex direction="row"> */}
                <Text
                  fontSize="16px"
                  fontWeight={500}
                >
                  {" "}
                  Change Password
                </Text>

                <Image
                  display="inline"
                  src={arrowImage}
                  alt="Profile"
                  mt={1}
                />
                {/* </Flex> */}
              </Button>
            </SimpleGrid>
          </Center>
        </VStack>
      </Center>
      <Navbar />
    </>
  );
};
