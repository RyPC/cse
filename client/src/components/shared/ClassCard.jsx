import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

export const ClassCard = ({
  title,
  description,
  location,
  capacity,
  level,
  costume,
}) => {
  return (
    <Card w={{ base: "80%", md: "20em" }}>
      <CardHeader>
        <Heading size="lg">{title}</Heading>
      </CardHeader>

      <CardBody>
        <VStack>
          <Text>{description}</Text>
          <Text>
            {level} - {location}
          </Text>
          <Text>Costume: {costume}</Text>
        </VStack>
      </CardBody>

      <CardFooter justifyContent="right">
        <Text>0/{capacity} spots left</Text>
        <Button>View Details</Button>
      </CardFooter>
    </Card>
  );
};
