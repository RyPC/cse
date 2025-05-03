import { useEffect } from "react";

import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Image,
  Input,
  Select,
  Stack,
  useToast,
  VStack,
} from "@chakra-ui/react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaGoogle } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { authenticateGoogleUser } from "../../utils/auth/providers";
import logo from "./logo.png";

const signupSchema = z.object({
  firstName: z.string().min(1, "Please include your first name."),
  lastName: z.string().min(1, "Please include your last name."),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  level: z.string(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { studentSignup, handleRedirectResult } = useAuthContext();
  const { backend } = useBackendContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const handleSignup = async (data: SignupFormValues) => {
    try {
      const user = await studentSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        level: data.level,
      });

      if (user) {
        navigate("/discovery");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "An error occurred",
          description: err.message,
          status: "error",
          variant: "subtle",
        });
      }
    }
  };

  const handleGoogleSignup = async () => {
    await authenticateGoogleUser();
  };

  useEffect(() => {
    handleRedirectResult(backend, navigate, toast);
  }, [backend, handleRedirectResult, navigate, toast]);

  return (
    <Box mt={"15.10vh"}>
      <Center>
        <Image
          src={logo}
          w="24.378vw"
          h="11.670vh"
          fit="contain"
        ></Image>
      </Center>

      <VStack
        spacing={8}
        sx={{ width: 300, marginX: "auto" }}
        mt={5}
      >
        <form
          onSubmit={handleSubmit(handleSignup)}
          style={{ width: "100%" }}
        >
          <Stack spacing={2}>
            <Center>
              <FormControl isInvalid={!!errors.firstName}>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  size={"lg"}
                  {...register("firstName")}
                  name="firstName"
                  isRequired
                  autoComplete="firstname"
                  h="3.661vh"
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl isInvalid={!!errors.lastName}>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  size={"lg"}
                  {...register("lastName")}
                  name="lastName"
                  isRequired
                  autoComplete="lastname"
                  h="3.661vh"
                />
              </FormControl>
            </Center>
            <Center>
              <FormControl
                isInvalid={!!errors.email}
                w={"100%"}
              >
                <FormLabel>Email Address</FormLabel>
                <Input
                  type="email"
                  size={"lg"}
                  {...register("email")}
                  name="email"
                  isRequired
                  autoComplete="email"
                  h="3.661vh"
                />
                <FormErrorMessage>
                  {errors.email?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            </Center>
            <Center>
              <FormControl isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  size={"lg"}
                  {...register("password")}
                  name="password"
                  isRequired
                  autoComplete="password"
                  h="3.661vh"
                />

                <FormErrorMessage>
                  {errors.password?.message?.toString()}
                </FormErrorMessage>
              </FormControl>
            </Center>
            <FormControl mt={4}>
              <Center>
                <Select
                  placeholder="Select a level..."
                  required
                  {...register("level")}
                >
                  <option value="beginner">Beginner </option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
              </Center>
              <Center>
                <ChakraLink
                  as={Link}
                  to="/login"
                ></ChakraLink>
              </Center>
            </FormControl>

            <Center>
              <Button
                type="submit"
                size={"lg"}
                bg="#422E8D"
                w={"48.2587vw"}
                color="white"
                isDisabled={Object.keys(errors).length > 0}
                mt={4}
              >
                Submit
              </Button>
            </Center>
          </Stack>
        </form>

        {/* <Button
          leftIcon={<FaGoogle />}
          variant={"solid"}
          size={"lg"}
          onClick={handleGoogleSignup}
          sx={{ width: "100%" }}
        >
          Signup with Google
        </Button> */}
      </VStack>
    </Box>
  );
};
