import { useEffect, useState } from "react";

import { Button, Flex, Modal } from "@chakra-ui/react";

import { Link } from "react-router-dom";

export const Bookings = () => {
  const handleClickEvents = () => {
    console.log("Booked events button has been pressed!");
  };
  const handleClickClasses = () => {
    console.log("Booked classes button has been pressed!");
  };
  const handleClickHistory = () => {
    console.log("Booked history button has been pressed!");
  };

  return (
    <div>
      <title>Bookings</title>
      <Button onClick={handleClickEvents}>Classes</Button>
      <Button onClick={handleClickClasses}>Classes</Button>
      <Button onClick={handleClickHistory}>History</Button>
    </div>
  );
};
