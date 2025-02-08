import React from "react";

import {
  Box,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";

const SettingsDashboard: React.FC = () => {
  const { currentUser } = useAuthContext();
  return (
    <Container maxW="container.sm">
      <Box mt={4}>
        <Heading
          as="h1"
          size="lg"
          mb={4}
        >
          Settings
        </Heading>
        <Box mt={2}>
          <FormControl mb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              value={currentUser?.displayName || ""}
              isReadOnly
              disabled
            />
          </FormControl>
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              value={currentUser?.email || ""}
              isReadOnly
              disabled
            />
          </FormControl>
        </Box>
      </Box>
    </Container>
  );
};

export default SettingsDashboard;
