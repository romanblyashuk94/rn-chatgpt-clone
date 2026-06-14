import { Model } from "@/util/interfaces";

export const MODELS: Model[] = [
  {
    title: "OpenAI",
    subTitle: "gpt-oss-20b",
    key: "openai/gpt-oss-20b:free",
    icon: "bolt",
  },
  {
    title: "OpenAI",
    subTitle: "gpt-oss-120b",
    key: "openai/gpt-oss-120b:free",
    icon: "brain",
  },
  {
    title: "Nvidia",
    subTitle: "nemotron-3-ultra",
    key: "nvidia/nemotron-3-ultra-550b-a55b:free",
    icon: "cpu",
  },
  {
    title: "Google",
    subTitle: "gemma-4",
    key: "google/gemma-4-31b-it:free",
    icon: "globe",
  },
];
