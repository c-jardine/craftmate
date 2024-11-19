import { ChakraProvider } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import superjson from "superjson";

import { RootLayout } from "~/layouts/RootLayout";
import { theme } from "~/styles/chakra/theme";
import { toastOptions } from "~/styles/chakra/toast";
import { api } from "~/utils/api";
import "../styles/globals.css";

// Automatically deserialize Prisma responses with Prisma.Decimal.
superjson.registerCustom<Prisma.Decimal, string>(
  {
    isApplicable: (v): v is Prisma.Decimal => v instanceof Prisma.Decimal,
    serialize: (v) => v.toString(),
    deserialize: (v) => new Prisma.Decimal(v),
  },
  "prisma.decimal"
);

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme} toastOptions={toastOptions}>
        <RootLayout>
          <Component {...pageProps} />
        </RootLayout>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
