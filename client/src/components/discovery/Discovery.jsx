import { VStack, Text, Input, Button, Flex } from "@chakra-ui/react";

export const Discovery = () => {
  return (
    <VStack>
      <Text>Discovery hi josh</Text>
      <Input placeholder="Search bar"></Input>
      <Flex gap="5">
        <Button>Classes</Button>
        <Button>Events</Button>
      </Flex>
    </VStack>
  );
};
