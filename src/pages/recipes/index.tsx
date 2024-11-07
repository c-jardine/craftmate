import { withAuth } from "~/server/auth";

export default function Recipes() {
  return <div>Recipes</div>;
}

export const getServerSideProps = withAuth();
