import {
  Button,
  Divider,
  Flex,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";
import logo from "./logo.png";
import { Login } from "../login/Login";

export const Landing = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login')
  }
  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <VStack justifyContent="center" alignItems="center" height={"100vh"}>
      {/* Showing the login page directly */}
        <Login/>
        <Flex alignItems="center" w={"48.2587vw"} my={4}>
            <Divider borderColor="gray.300" />
            <Text mx={2} color="gray.500" whiteSpace="nowrap">OR</Text>
            <Divider borderColor="gray.300" />
        </Flex>
        <Button
            type="submit"
            size={"lg"}
            bg="#E2E8F0"
            w={"48.2587vw"}
            color="white"
            mt={4}
            onClick={handleSignup}
            textColor={"#71717A"}
            >
            Signup
        </Button>
    </VStack>
  );
};
