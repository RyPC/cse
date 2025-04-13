import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Stack, Image, Link, Badge, Flex } from "@chakra-ui/react";

export const VideoCard = ({ id, title, description, S3Url, classId, classTitle, mediaUrl, tags }) => {
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

          <Flex gap={1} wrap="nowrap">
            {tags?.length > 0 &&
              tags.map((tag, index) => (
                <Badge
                  key={index}
                  rounded="lg"
                  px={3}
                  py={1}
                  textTransform="none"
                >
                  {tag}
                </Badge>
              ))}
          </Flex>
        </Stack>
      </CardBody>
    </Card>
  );
};
