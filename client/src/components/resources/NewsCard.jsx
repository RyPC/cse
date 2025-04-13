import { Card, CardBody, Text, Stack, Link, Image, Badge, Flex } from "@chakra-ui/react";

export const NewsCard = ({ id, S3Url, description, mediaUrl, tags }) => {
  return (
    <Card w={{base: "80%", md: "20em"}}>
      <CardBody>
        <Stack gap={2}>
          <Text fontSize="md">{description ?? "No description"}</Text>
          <Link href={mediaUrl} isExternal>
            <Image src={S3Url} alt={`image for video article ${id}`} />
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
