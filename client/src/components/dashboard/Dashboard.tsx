import { useEffect, useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { Outlet, useNavigate } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useBackendContext } from "../../contexts/hooks/useBackendContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";
import { Class } from "../../types/class";
import { User } from "../../types/user";
import { NotificationPanel } from "./NotificationPanel";

interface StatCardProps {
  icon: string;
  iconColor: string;
  label: string;
  value: string | number;
}

export const StatCard = ({ iconColor, label, value }: StatCardProps) => {
  return (
    <Flex
      bg="gray.100"
      p={4}
      borderRadius="md"
      shadow="md"
      direction="row"
      align="center"
      w={["100%", "30%"]} // Responsive width
      mb={[4, 0]} // Margin bottom for mobile
    >
      <Icon
        as="circle"
        boxSize="50px"
        color={iconColor}
        mr={4}
      />
      <Flex direction="column">
        <Text color="black">{label}</Text>
        <Text
          fontSize="3xl"
          fontWeight="bold"
          color="black"
        >
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};

export const Dashboard = () => {
  return (
    <Flex>
      <Sidebar />
      <Box
        ml="200px"
        p={5}
        w="100%"
      >
        <Outlet />
      </Box>
    </Flex>
  );
};

export const DashboardHome = () => {
  const { logout, currentUser } = useAuthContext();
  const { backend } = useBackendContext();
  const { role } = useRoleContext();

  const [users, setUsers] = useState<User[] | undefined>();
  const [classes, setClasses] = useState<Class[] | undefined>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const notifRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await backend.get("/users");
        setUsers(usersResponse.data);

        const classesResponse = await backend.get("/classes");
        setClasses(classesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [backend]);
  const [selectedPeriod, setSelectedPeriod] = useState("day");

  return (
    <Box w="100%">
      <VStack
        spacing={8}
        sx={{ maxWidth: "100%", marginX: "auto", padding: 4 }}
      >
        <Flex w={"100%"} justify={"space-between"}>
          <Heading alignSelf="flex-start">Dashboard</Heading>
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

        {/* Stat Cards */}
        <Flex
          justifyContent="space-between"
          alignItems="center"
          w="100%"
          direction={["column", "row"]} // Column for mobile, row for larger screens
          gap={4}
        >
          <StatCard
            icon="email"
            iconColor="blue.500"
            label="Total Students"
            value={users?.length || 0}
          />
          <StatCard
            icon="email"
            iconColor="green.500"
            label="Attendance Rate"
            value={"15%"}
          />
          <StatCard
            icon="email"
            iconColor="purple.500"
            label="Total Classes"
            value={classes?.length || 0}
          />
        </Flex>

        {/* Graph Placeholder */}
        <Box
          bg="gray.100"
          w="100%"
          h="200px"
          borderRadius="md"
          display="flex"
          position={"relative"}
          alignItems="center"
          justifyContent="center"
        >
          <Text color="gray.500">Graph Placeholder</Text>
          <Box
            position="absolute"
            top="4"
            right="4"
          >
            <Flex
              bg="white"
              borderRadius="full"
              border="1px"
              borderColor="gray.200"
              p={1}
              shadow="sm"
            >
              {["day", "week", "month"].map((period) => (
                <Box
                  key={period}
                  px={3}
                  py={1}
                  cursor="pointer"
                  borderRadius="full"
                  bg={selectedPeriod === period ? "blue.500" : "transparent"}
                  color={selectedPeriod === period ? "white" : "gray.600"}
                  onClick={() => setSelectedPeriod(period)}
                  _hover={{
                    bg: selectedPeriod === period ? "blue.600" : "gray.100",
                  }}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Box>
              ))}
            </Flex>
          </Box>
        </Box>

        {/* Signed-in User Info */}
        <VStack>
          <Text>
            Signed in as {currentUser?.email} (
            {role === "admin" ? "Admin" : "User"})
          </Text>
          <Button onClick={logout}>sign out</Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <Box
      as="nav"
      pos="fixed"
      left={0}
      h="100vh"
      bg="gray.800"
      w="200px"
      p={5}
    >
      <VStack
        spacing={4}
        align="stretch"
      >
        <Box
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "gray.700" }}
          color="white"
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </Box>
        <Box
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "gray.700" }}
          color="white"
          onClick={() => navigate("/dashboard/classes")}
        >
          Classes
        </Box>
        <Box
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "gray.700" }}
          color="white"
          onClick={() => navigate("/teachers")}
        >
          Teachers
        </Box>
        <Box
          as="button"
          p={3}
          borderRadius="md"
          _hover={{ bg: "gray.700" }}
          color="white"
          onClick={() => navigate("/dashboard/settings")}
        >
          Settings
        </Box>
      </VStack>
    </Box>
  );
};
