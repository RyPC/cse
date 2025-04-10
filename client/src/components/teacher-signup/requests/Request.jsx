import { Box, Button, Image, Text, VStack } from "@chakra-ui/react";
import {useNavigate, useLocation} from "react-router-dom";
import centerStageLogo from "./cse-logo.png";

const Request = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const pending = location.pathname.includes("pending");


    const message = pending 
        ? 'Pending account verification. Once approved, check your email to log in'
        : 'Request sent! Once approved, check your email to log in';


        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <VStack textAlign="center">

                <Image
                    src={centerStageLogo}
                    boxSize="100px"
                    // borderRadius="full"
                    objectFit="contain"
                    alt="Center Stage Logo"
                />
        
                <Text fontSize="lg" w={"50%"}>{message}</Text>
        
                <Button
                  bg="#422e8d"
                  color="white"
                  w="200px"
                  h="55px"
                  onClick={() => navigate("/login")}>
                  OK
                </Button>
              </VStack>
            </Box>
          );
}

export default Request