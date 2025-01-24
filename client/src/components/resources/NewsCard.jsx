import { Card, CardBody, Text } from "@chakra-ui/react";

export const NewsCard = ({ id, S3Url, description, mediaUrl }) => {
  return (
    <Card w={{base: "80%", md: "20em"}}>
      <CardBody>
        <Text>ID: {id}</Text>
        <Text>S3 URL: {S3Url}</Text>
        <Text>Description: {description}</Text>
        <Text>Media URL: {mediaUrl}</Text>
      </CardBody>
    </Card>
  );
};





// 0
// id	10
// s3Url	"ok.png"
// description	"Teset"
// mediaUrl	"https://ok.com/ok.jpg"
// 1
// id	13
// s3Url	"ok.png"
// description	"Pronsh"
// mediaUrl	"https://ok.com/ok.jpg"
// 2
// id	9
// s3Url	"new"
// description	"Teset"
// mediaUrl	"https://ok.com/ok.jpg"
// 3
// id	12
// s3Url	"test.png"
// description	"test description"
// mediaUrl	"google.com"
