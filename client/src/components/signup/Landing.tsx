import {
  Button,
  Image,
  VStack,
} from "@chakra-ui/react";

import { useNavigate } from "react-router-dom";


import logo from "./logo.png";




export const Landing = () => {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate('/login')
  }
  const handleSignup = () => {
    navigate('/signup')
  }

  return (
    <VStack justifyContent="center" alignItems="center" paddingTop="50%">
        <Image src={logo} fit="contain"></Image>
        <Button
            type="submit"
            size={"lg"}
            bg="#422E8D"
            w={"48.2587vw"}
            color="white"
            mt={4}
            onClick={handleSignup}
            >
            Signup
        </Button>
        <Button
            type="submit"
            size={"lg"}
            bg="#422E8D"
            w={"48.2587vw"}
            color="white"
            mt={4}
            onClick={handleLogin}
            >
            Login
        </Button>
    </VStack>
  );
};
