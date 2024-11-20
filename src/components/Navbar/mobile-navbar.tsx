import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Squash } from "hamburger-react";
import { signIn, useSession } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FaEdit, FaSignInAlt } from "react-icons/fa";

import { isActiveLink } from "~/utils/router";
import { ColorModeToggle } from "../color-mode-toggle";
import { DesktopSignOut } from "./desktop-sign-out";

export function MobileNavbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/materials", label: "Materials" },
    { href: "/products", label: "Products" },
    { href: "/recipes", label: "Recipes" },
    { href: "/history", label: "History" },
  ];

  return (
    <>
      <HStack
        display={{ base: "flex", md: "none" }}
        justifyContent="space-between"
        alignItems="center"
        h="full"
        w="full"
      >
        {/* Brand */}
        <Box>
          <Link as={NextLink} href="/" fontWeight="bold">
            Craftmate
          </Link>
        </Box>

        {session && (
          <IconButton
            icon={<Icon as={Squash} toggled={isOpen} size={16} />}
            aria-label="Open menu"
            onClick={onOpen}
          />
        )}

        {!session && !isActiveLink(router, "/auth/signin") && (
          <Button
            leftIcon={<Icon as={FaSignInAlt} />}
            variant="primary"
            onClick={() => signIn()}
          >
            Sign in
          </Button>
        )}
      </HStack>

      <Drawer isOpen={isOpen} onClose={onClose} variant="userMenu">
        <DrawerOverlay
          h="calc(100% - 4rem - 1px)"
          top="calc(4rem - 1px) !important"
        />
        <DrawerContent
          h="calc(100% - 4rem - 1px)"
          top="calc(4rem - 1px) !important"
        >
          {/* <DrawerHeader>Menu</DrawerHeader> */}
          <DrawerBody>
            {/* Session nav links */}
            {session && (
              <Stack spacing={0}>
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    variant={(() => {
                      if (href === "/") {
                        if (router.asPath === "/") {
                          return "menuLinkActive";
                        }
                        return "menuLink";
                      }
                      return isActiveLink(router, href)
                        ? "menuLinkActive"
                        : "menuLink";
                    })()}
                  >
                    {label}
                  </Link>
                ))}

                <Divider />

                <Link as={NextLink} href="/settings" variant="menuLink">
                  Settings
                </Link>
                <Link as={NextLink} href="/edit-profile" variant="menuLink">
                  Edit profile
                </Link>
                <Link as={NextLink} href="/help" variant="menuLink">
                  Help
                </Link>
              </Stack>
            )}
          </DrawerBody>
          {session && (
            <DrawerFooter>
              <Stack w="full">
                <Text fontSize="sm">Signed in as</Text>
                <HStack>
                  <Avatar
                    size="sm"
                    name={session?.user.name ?? "Current user"}
                    src={session?.user.image ?? undefined}
                  />
                  <Text flexGrow={1} fontSize="sm" fontWeight="semibold">
                    {session?.user.name}
                  </Text>
                  <IconButton
                    icon={<Icon as={FaEdit} />}
                    aria-label="Sign out"
                  />
                </HStack>

                <HStack justifyContent="space-between">
                  <ColorModeToggle />
                  <DesktopSignOut />
                </HStack>
              </Stack>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
