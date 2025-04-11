import { Card, CardHeader, CardBody, CardFooter, Text } from "@chakra-ui/react";

export const VideoCard = ({ id, title, description, S3Url, classId, mediaUrl }) => {
  return (
    <Card w={{base: "80%", md: "20em"}}>
      <CardHeader fontSize = "large"fontWeight="bold">{title}</CardHeader>
      <CardBody>
        <Text fontSize = "medium">{description}</Text>
        <iframe
          width="100%"
          height="200"
          title={title}
          src = {mediaUrl}
          allowFullScreen
        ></iframe>
{/*         
        <Text>ID: {id}</Text>
        <Text>S3 URL: {S3Url}</Text>
        <Text>Media URL: {mediaUrl}</Text>
        <Text>Class ID: {classId}</Text> */}
      </CardBody>
    </Card>
  );
};
