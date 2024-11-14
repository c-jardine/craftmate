import {
  type ContainerProps,
  Heading,
  type HeadingProps,
  HStack,
  type StackProps,
} from "@chakra-ui/react";
import { type ReactNode } from "react";

import { PageSection } from "../page-section";

interface PageHeaderContentProps extends StackProps {
  children: ReactNode;
}

function PageHeaderContent({ children, ...props }: PageHeaderContentProps) {
  return (
    <HStack gap={4} {...props}>
      {children}
    </HStack>
  );
}

interface PageHeaderTitleProps extends HeadingProps {
  children: ReactNode;
}

function PageHeaderTitle({ children, ...props }: PageHeaderTitleProps) {
  return (
    <Heading as="h1" flexGrow={1} {...props}>
      {children}
    </Heading>
  );
}

interface PageHeaderProps extends ContainerProps {
  children: ReactNode;
}

export function PageHeader({ children, ...props }: PageHeaderProps) {
  return <PageSection {...props}>{children}</PageSection>;
}

PageHeader.Content = PageHeaderContent;
PageHeader.Title = PageHeaderTitle;
