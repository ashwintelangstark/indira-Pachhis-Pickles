import { createFileRoute } from "@tanstack/react-router";
import { AboutPage } from "./about";

export const Route = createFileRoute("/our-story")({
  head: () => ({
    meta: [
      { title: "Our Story — A Legacy of Love, Preserved Through Generations | Indira Pachhi's" },
      {
        name: "description",
        content:
          "The complete 7-chapter story of Indira Pachhi's Pickles and Chutney Powders. Three generations of dedication, authentic family recipes, and traditional flavours.",
      },
    ],
  }),
  component: AboutPage,
});
