import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";
import { Button, Input, Stack } from "@chakra-ui/react";
import axios from "axios";
import { z } from "zod";

export const Playground = () => {
  return (
    <Box>
      <Text>
        This is page will be used to test any modal or component that does not
        have a specific place for it yet!
      </Text>
    </Box>
  );
};

export const Playground_2 = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    const schema = z.object({
      firstName: z.string().min(1, "First name is required"),
      lastName: z.string().min(1, "Last name is required"),
      role: z.string().min(1, "Role is required"),
      email: z.string().email("Invalid email address"),
    });

    const validation = schema.safeParse(formData);
    if (!validation.success) {
      alert(validation.error.errors.map((err) => err.message).join("\n"));
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users",
        formData,
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Text>
        This is page will be used to test any modal or component that does not
        have a specific place for it yet!
      </Text>
      <Stack spacing={3} mt={4}>
        <Input
          placeholder="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <Input
          placeholder="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Input
          placeholder="Role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        />
        <Input
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <Button onClick={handleSubmit}>Send</Button>
      </Stack>
    </Box>
  );
};
