import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Stack, Image, Link } from "@chakra-ui/react";

export const VideoCard = ({ id, title, description, S3Url, classId, classTitle, mediaUrl, tags }) => {
  // console.log(S3Url);
  return (
    <Card w={{base: "100%", md: "20em"}}>
      <CardBody>
        <Stack gap={2}>
          <Heading size="md">{title}</Heading>
          <Text fontSize="md">{description ?? "No description"}</Text>
          <Text fontSize="sm">Posted by "Instructor Name" for {classTitle}</Text> {/* Implement Instructor Name at later task! - josh :D */}
          <Link href={mediaUrl} isExternal>
            <Image src={S3Url} alt={`image for video ${title}`} />
          </Link>
          {tags?.length && <Text>Tags: {tags.join(', ')}</Text>}
        </Stack>
      </CardBody>
    </Card>
  );
};
