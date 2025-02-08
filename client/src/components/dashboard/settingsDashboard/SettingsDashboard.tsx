import {React, useRef} from "react";

import {
  Box,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  useDisclosure,
} from "@chakra-ui/react";

import { useAuthContext } from "../../../contexts/hooks/useAuthContext";
import { NotificationPanel } from "../NotificationPanel";

const SettingsDashboard: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();
  const { currentUser } = useAuthContext();
  return (
    <Container maxW="container.sm">
      <Box mt={4} w={"100%"}>
        <Flex
          w={"100%"}
          justify={"space-between"}
        >
          <Heading
            as="h1"
            size="lg"
            mb={4}
          >
            Settings
          </Heading>
          <Image
            alignSelf={"flex-end"}
            cursor="pointer"
            onClick={onOpen}
            ref={notifRef}
            src="../bell.png"
          />
          <NotificationPanel
            isOpen={isOpen}
            onClose={onClose}
          />
        </Flex>
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
