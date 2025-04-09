import { useState } from "react";

import { Box, Flex, Image } from "@chakra-ui/react";

import { Link } from "react-router-dom";

import { useAuthContext } from "../../contexts/hooks/useAuthContext";
import bookingsImg from "./bookings_img.svg";
import discoveryImg from "./discovery_img.svg";
import profileImg from "./profile_img.svg";
import resourcesImg from "./resources_img.svg";

export const Navbar = () => {
  const { role } = useAuthContext();

  return (
    <Box
      as="footer"
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      bg="#E8E7EF"
      p={3}
      padding={5}
    >
      <Flex
        justify="space-around"
        align="center"
        gap="14"
      >
        <Link to="/profile">
          <Image
            maxWidth="2rem"
            style={{ userSelect: "none" }}
            src={profileImg}
          ></Image>
        </Link>
        {role !== "teacher" && (
          <Link to="/discovery">
            <Image
              maxWidth="2rem"
              style={{ userSelect: "none" }}
              src={discoveryImg}
            ></Image>
          </Link>
        )}
        <Link to="/bookings">
          <Image
            maxWidth="2rem"
            style={{ userSelect: "none" }}
            src={bookingsImg}
          ></Image>
        </Link>
        <Link to="/resources">
          <Image
            maxWidth="2rem"
            style={{ userSelect: "none" }}
            src={resourcesImg}
          ></Image>
        </Link>
      </Flex>
    </Box>
  );
};
