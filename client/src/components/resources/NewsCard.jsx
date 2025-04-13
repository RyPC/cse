import { Card, CardBody, Text, Stack, Link, Image } from "@chakra-ui/react";

export const NewsCard = ({ id, S3Url, description, mediaUrl, tags }) => {
  return (
    <Card w={{base: "80%", md: "20em"}}>
      <CardBody>
        <Stack gap={2}>
          <Text fontSize="md">{description ?? "No description"}</Text>
          <Link href={mediaUrl} isExternal>
            <Image src={S3Url} alt={`image for video article ${id}`} />
          </Link>
          {tags?.length && <Text>Tags: {tags.join(', ')}</Text>}
        </Stack>
      </CardBody>
    </Card>
  );
};
