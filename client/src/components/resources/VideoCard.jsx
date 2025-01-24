import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";

export const VideoCard = ({ id, title, description, S3Url, classId, mediaUrl }) => {
  return (
    <Card w={{base: "80%", md: "20em"}}>
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <Text>ID: {id}</Text>
        <Text>S3 URL: {S3Url}</Text>
        <Text>Description: {description}</Text>
        <Text>Media URL: {mediaUrl}</Text>
        <Text>Class ID: {classId}</Text>
      </CardBody>
    </Card>
  );
};
