import { useEffect } from "react";

import {
  Button,
  Center,
  Link as ChakraLink,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
import { EmailTemplate } from "../signup/EmailTemplate";
import ReactDOMServer from "react-dom/server";
import centerStageLogo from "./requests/cse-logo.png";

const signupSchema = z.object({
  firstName: z.string().min(1, "Field Cannot Be Empty"),
  lastName: z.string().min(1, "Field Cannot Be Empty"),
  experience: z.string().min(1, "Must Select an Experience Value"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const TeacherSignup = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { teacherSignup, handleRedirectResult, updateDisplayName } = useAuthContext();
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
      const user = await teacherSignup({
        firstName: data.firstName,
        lastName: data.lastName,
        experience: data.experience,
        email: data.email,
        password: data.password,
      });

      if (user) {
        updateDisplayName(user, data.firstName + " " + data.lastName)
        const templateEmail = EmailTemplate( {"firstName": data.firstName, "lastName":data.lastName, "email": data.email, "role": "teacher"});
        backend.post("/nodemailer/send", {
          "to": import.meta.env.VITE_ADMIN_EMAIL,
          "html": ReactDOMServer.renderToString(templateEmail)
        });
        navigate("/teacher-signup/request");
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
    <VStack
      spacing={8}
      sx={{ width: 300, marginX: "auto" }}
    >
      <Heading>Teacher Signup</Heading>
      <Image src={centerStageLogo}></Image>

      <form
        onSubmit={handleSubmit(handleSignup)}
        style={{ width: "100%" }}
      >
        <Stack spacing={2}>
          <FormControl
            w="100%"
            isInvalid={!!errors.firstName}
          >
            <FormHelperText>First Name</FormHelperText>
            <Center>
              <Input
                placeholder="First Name"
                size="lg"
                {...register("firstName")}
                name="firstName"
                isRequired
                autoComplete="firstName"
              />
            </Center>
            <FormErrorMessage>
              {errors.firstName?.message?.toString()}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            w="100%"
            isInvalid={!!errors.lastName}
          >
            <FormHelperText>Last Name</FormHelperText>
            <Center>
              <Input
                placeholder="Last Name"
                size="lg"
                {...register("lastName")}
                name="lastName"
                isRequired
              />
            </Center>
            <FormErrorMessage>
              {errors.lastName?.message?.toString()}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            w="100%"
            isInvalid={!!errors.experience}
          >
            <FormHelperText>Experience Level</FormHelperText>
            <Center>
              <Select
                placeholder="Select Experience Level"
                {...register("experience")}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </Center>
            <FormErrorMessage>
              {errors.experience?.message?.toString()}
            </FormErrorMessage>
          </FormControl>

          <FormControl
            isInvalid={!!errors.email}
            w={"100%"}
          >
            <FormHelperText>Email</FormHelperText>
            <Center>
              <Input
                placeholder="Email"
                type="email"
                size={"lg"}
                {...register("email")}
                name="email"
                isRequired
                autoComplete="email"
              />
            </Center>
            <FormErrorMessage>
              {errors.email?.message?.toString()}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.password}>
          <FormHelperText>Password</FormHelperText>
            <Center>
              <Input
                placeholder="Password"
                type="password"
                size={"lg"}
                {...register("password")}
                name="password"
                isRequired
                autoComplete="password"
              />
            </Center>
            <FormErrorMessage>
              {errors.password?.message?.toString()}
            </FormErrorMessage>

            <ChakraLink
              as={Link}
              to="/login"
            >
              <FormHelperText>Click here to login</FormHelperText>
            </ChakraLink>
          </FormControl>

          <Center>
            <Button
              type="submit"
              size={"lg"}
              // sx={{ width: "100%" }}
              isDisabled={Object.keys(errors).length > 0}
              bg="#422e8d"
              color="white"
              w="200px"
              h="55px"
              >
              Submit
            </Button>
          </Center>
          {/* Removed SelectRoot component as it was causing an error */}
        </Stack>
      </form>

      <Button
        leftIcon={<FaGoogle />}
        variant={"solid"}
        size={"lg"}
        onClick={handleGoogleSignup}
        // sx={{ width: "100%" }}
        w="200px"
        h="55px"
      >
        Signup with Google
      </Button>
    </VStack>
  );
};
