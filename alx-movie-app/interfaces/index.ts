import { ReactNode } from "react";

export interface ComponentProps {
  children: ReactNode;
}

export interface ButtonProps {
  title: string;
  action?: () => void;
  variant?: "primary" | "outline" | "ghost";
  isActive?: boolean;
  type?: "button" | "submit";
}

export interface MovieProps {
  id?: string;
  posterImage: string;
  releaseYear: string;
  title: string;
}

interface PrimaryImage {
  url: string;
}

interface TitleText {
  text: string;
}

interface ReleaseYear {
  year: string;
}

interface PlotText {
  plainText?: string;
}

interface PlotBlock {
  plotText?: PlotText;
}

interface RuntimeBlock {
  seconds?: number;
}

interface RatingsSummaryBlock {
  aggregateRating?: number;
  voteCount?: number;
}

export interface MoviesProps {
  id: string;
  primaryImage?: PrimaryImage;
  titleText?: TitleText;
  releaseYear?: ReleaseYear;
  titleType?: string;
  genres?: string[];
  plot?: PlotBlock;
  runtime?: RuntimeBlock;
  ratingsSummary?: RatingsSummaryBlock;
}