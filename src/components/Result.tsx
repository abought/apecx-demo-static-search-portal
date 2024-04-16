"use client";
import React from "react";
import {
  Heading,
  Text,
  Box,
  Code,
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Divider,
  Skeleton,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
  Alert,
} from "@chakra-ui/react";
import { getAttribute, getAttributeFrom } from "../../static";

import type { GError, GMetaResult } from "../app/page";
import { get } from "lodash";

type FieldDefinition =
  | string
  | {
      label: string;
      property: string;
    }
  | {
      label: string;
      value: unknown;
    };

export type ResultComponentOptions = {
  /**
   * The field to use as the title for the result.
   * @default "subject"
   * @example "entries[0].content.title"
   * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
   */
  heading?: string;
  /**
   * The field to use as the summary for the result.
   * @example "entries[0].content.summary"
   * @see https://docs.globus.org/api/search/reference/get_subject/#gmetaresult
   */
  summary?: string;
  /**
   * The fields to display in the result.
   * A field can be a string, an object with a `label` and `property`, or an object with a `label` and `value`.
   * @example
   * ["entries[0].content.purpose", "entries[0].content.tags"]
   * @example
   * [
   *    "entries[0].content.tags",
   *    { label: "Purpose", "property": "entries[0].content.purpose" },
   *    { label: "Note", value: "Lorem ipsum dolor sit amet."}
   * ]
   */
  fields?: FieldDefinition[];
};

const FieldValue = ({ value }: { value: unknown }) => {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return <Text as="p">{value}</Text>;
  }
  if (Array.isArray(value)) {
    return value.map((v, i) => (
      <Box key={i}>
        <FieldValue value={v} />
      </Box>
    ));
  }
  return <Code>{JSON.stringify(value, null, 2)}</Code>;
};

const Field = ({
  field,
  gmeta,
  isLoading,
}: {
  field: FieldDefinition;
  gmeta: GMetaResult;
  isLoading: boolean;
}) => {
  const processedField =
    typeof field === "string" ? { label: undefined, property: field } : field;
  const value =
    "value" in processedField
      ? processedField.value
      : get(gmeta, processedField.property, "–");
  return (
    <Box my="2">
      {processedField.label && (
        <Heading as="h2" size="sm" my={2}>
          {processedField.label}
        </Heading>
      )}
      <Skeleton isLoaded={!isLoading}>
        <FieldValue value={value} />
      </Skeleton>
    </Box>
  );
};

export default function Result({
  result,
  isLoading,
}: {
  result?: GMetaResult | GError;
  isLoading: boolean;
}) {
  if (!result) {
    return (
      <Center>
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Center>
    );
  }

  if (result["@datatype"] === "GError") {
    return (
      <Alert
        status="error"
        flexDirection="column"
        alignItems="start"
        justifyContent="center"
        padding={10}
      >
        <AlertIcon boxSize="40px" />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Error Encountered
        </AlertTitle>
        <AlertDescription>{result.message}</AlertDescription>
      </Alert>
    );
  }
  const heading = getAttributeFrom<string>(
    result,
    "components.ResultListing.heading",
  );

  const summary = getAttributeFrom<string>(
    result,
    "components.ResultListing.summary",
  );

  const fields = getAttribute("components.Result.fields", []);

  return (
    <>
      <Skeleton isLoaded={!isLoading}>
        <Heading as="h1" size="md" color="brand">
          {heading}
        </Heading>
      </Skeleton>

      <Divider my={2} />

      <Flex>
        <Box p="2">
          {summary && (
            <Box my="2">
              <Heading as="h2" size="sm" my={2}>
                Summary
              </Heading>
              <Skeleton isLoaded={!isLoading}>
                <Text as="p">{summary}</Text>
              </Skeleton>
            </Box>
          )}

          {fields.map((field: any, i: number) => (
            <Field key={i} field={field} gmeta={result} isLoading={isLoading} />
          ))}

          {/* 
          <Box my="2">
            <Heading as="h2" size="sm" my={2}>
              Purpose
            </Heading>
            <Skeleton isLoaded={!isLoading}>
              <Text as="p">{result.purpose}</Text>
            </Skeleton>
          </Box>

          <Box my="2">
            <Wrap>
              {result.tags.map((tag: any, i: number) => (
                <WrapItem key={i}>
                  <Skeleton isLoaded={!isLoading}>
                    <Tag>{tag.name}</Tag>
                  </Skeleton>
                </WrapItem>
              ))}
            </Wrap>
          </Box>

          <Box my="2">
            <Heading as="h2" size="sm" my={2}>
              Contacts
            </Heading>
            <VStack
              divider={<StackDivider borderColor="gray.200" />}
              spacing={2}
              align="stretch"
            >
              {result.contacts.map((contact: any, i: number) => (
                <Box key={i}>
                  <Text>
                    {contact.email ? (
                      <Link color="brand.500" href={`mailto:${contact.email}`}>
                        {contact.name}
                      </Link>
                    ) : (
                      contact.name
                    )}
                  </Text>
                  <Text fontSize="xs">{contact.type}</Text>
                </Box>
              ))}
            </VStack>
          </Box> */}
        </Box>
        <Box p="2">
          {/* <Box my="2">
            <Heading as="h2" size="xs" my={2}>
              Citation
            </Heading>
            <Skeleton isLoaded={!isLoading}>
              <Text as="cite">{result.citation}</Text>
            </Skeleton>
          </Box>

          <Box my="2">
            <Heading as="h2" size="xs" my={2}>
              Dates
            </Heading>
            {result.dates.map((date: any, i: number) => (
              <Skeleton key={i} isLoaded={!isLoading}>
                <Flex>
                  <Text>{date.label || date.type}</Text>
                  <Spacer />
                  <Text>{date.dateString}</Text>
                </Flex>
              </Skeleton>
            ))}
          </Box> */}

          {!isLoading && (
            <ResponseDrawer>
              <Code as="pre">{JSON.stringify(result, null, 2)}</Code>
            </ResponseDrawer>
          )}
        </Box>
      </Flex>
    </>
  );
}

function ResponseDrawer({ children }: { children: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  return (
    <>
      <Button
        ref={btnRef.current}
        colorScheme="gray"
        onClick={onOpen}
        size="xs"
      >
        View Raw Search result
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef.current}
        size="xl"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader />

          <DrawerBody>{children}</DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
