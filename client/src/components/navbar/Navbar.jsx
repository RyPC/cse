import { useState } from "react";

import { Box, Flex, Icon, Text, VStack } from "@chakra-ui/react";

import { Link, useLocation } from "react-router-dom";

import { FaSearch, FaCalendarAlt, FaBook, FaUser } from 'react-icons/fa';

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import { useRoleContext } from "../../contexts/hooks/useRoleContext";


export const Navbar = () => {
  const { role: user_role } = useAuthContext();
  const { role } = useRoleContext();
  console.log("role from navbar:", role);
  const location = useLocation();
  const dashboardImg = "./dashboard.svg";

  const navItems = [
    ...(role === 'admin' ? [{path: "/dashboard", src: dashboardImg, label: "Dashboard"}] : []),
    ...((user_role !== 'teacher' || role === 'admin') ? [{ path: "/discovery", icon: FaSearch, label: "Discovery" }] : []),
    { path: "/bookings", icon: FaCalendarAlt, label: "Schedule" },
    { path: "/resources", icon: FaBook, label: "Resources" },
    { path: "/profile", icon: FaUser, label: "Profile" },
  ];

  return (
    console.log("my role:", role),
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="#FFFFFF"
      borderTop="1px solid"
      borderColor="gray.200"
      p={2}
      zIndex="sticky"
    >
      <Flex
        justify="space-around"
        align="center"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link to={item.path} key={item.path}>
              <VStack spacing={1}>
                <Icon as={item.icon} boxSize={6} color={isActive ? "purple.600" : "gray.500"} />
                <Text fontSize="xs" color={isActive ? "purple.600" : "gray.500"} fontWeight={isActive ? "bold" : "normal"}>
                  {item.label}
                </Text>
              </VStack>
            </Link>
          );
        })}
      </Flex>
    </Box>
  );
};
