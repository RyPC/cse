import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Stack } from "@chakra-ui/react";

// can componetize VideoCard and NewsCard into ResourceCard as theyre quite similar
export const VideoCard = ({ id, title, description, S3Url, classId, mediaUrl, tags }) => {
  return (
    <Card w={{base: "100%", md: "20em"}}>
      <CardBody>
        <Stack gap={2}>
          <Heading size="md">{title}</Heading>
          <Text>ID: {id}</Text>
          {/* <Text>S3 URL: {S3Url}</Text> */}
          <Text fontSize="md">{description ?? "No description"}</Text>
          <Text fontSize="sm">Posted by "instructor name" for "Class Name"</Text>
          <Text>Media URL: {mediaUrl}</Text>
          <Text>Tags: {tags?.length ? tags.join(', ') : 'None'}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
};
