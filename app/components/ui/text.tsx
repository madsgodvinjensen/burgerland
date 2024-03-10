import React from "react";
import { cn } from "../../lib/utils";

type HeadingProps = {
  as?: React.ElementType;
  headingStyle?: "h1" | "h2" | "h3";
  children?: React.ReactNode;
};

export const Heading = ({
  as = "h1",
  headingStyle = "h1",
  children,
}: HeadingProps) => {
  return React.createElement(
    as,
    {
      className: cn("font-display font-bold ", {
        "text-2xl font-bold uppercase": headingStyle === "h1",
        "text-lg font-bold uppercase": headingStyle === "h2",
        "text-lg font-medium": headingStyle === "h3",
      }),
    },
    children
  );
};

type HighlightProps = { as?: React.ElementType; children?: React.ReactNode };

export const Highlight = ({ as = "span", children }: HighlightProps) => {
  return React.createElement(as, { className: "font-semibold" }, children);
};

type ErrorMessageProps = { as?: React.ElementType; children?: React.ReactNode };

export const ErrorMessage = ({ as = "span", children }: ErrorMessageProps) => {
  return React.createElement(
    as,
    {
      className: "text-red-600 font-bold",
    },
    children
  );
};
