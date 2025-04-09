export type CertificateType = "chapter" | "book" | "region";

export interface CertificateData {
  type: CertificateType;
  title: string;
  bookTitle: string;
  chapterTitle: string;
  authors: string[];
  coauthors: string[];
  isbn: string;
  pages: string;
  totalPages: string;
  publicationDate: string;
  region: string;
  validationUrl: string;
  logo: string | null;
  signature: string | null;
  headerImage: string | null;
  footerImage: string | null;
}
