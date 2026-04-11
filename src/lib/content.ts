import contentData from "../../data/content.json";

export function getContent() {
  return contentData;
}

export type Content = typeof contentData;
