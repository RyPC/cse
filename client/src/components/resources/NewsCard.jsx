import { Card, CardBody, Text, Stack } from "@chakra-ui/react";

export const NewsCard = ({ id, S3Url, description, mediaUrl, tags }) => {
  return (
    <Card w={{base: "80%", md: "20em"}}>
      <CardBody>
        <Stack gap={2}>
          {/* <Text>ID: {id}</Text> */}
          {/* <Text>S3 URL: {S3Url}</Text> */}
          <Text fontSize="md">{description ?? "No description"}</Text>
          <Text fontSize="sm">Posted by "Instructor Name" for "Class Name"</Text>
          <Text>Media URL: {mediaUrl}</Text>
          {tags?.length && <Text>Tags: {tags.join(', ')}</Text>}
          {/* <Text>Tags: {tags?.length ? tags.join(', ') : 'No tags!'}</Text> */}
        </Stack>
      </CardBody>
    </Card>
  );
};
