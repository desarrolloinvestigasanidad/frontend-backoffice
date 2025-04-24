export type CertificateType = "chapter" | "book" | "region";

export interface CertificateData {
  type: CertificateType;
  title: string;
  bookTitle: string;
  chapterTitle?: string;
  chapterNumber?: string;
  authors: string[];
  coauthors: string[];
  isbn: string;
  pages: string;
  totalPages: string;
  publicationDate: string;
  region?: string;
  validationUrl: string;
  logo: string | null;
  signature: string | null;
  headerImage: string | null;
  footerImage: string | null;
  editionId?: string;
  bookId?: string;
  userId?: string;
  customText?: string;
  certificateType?: string;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  title?: string;
  headerImage?: string;
  footerImage?: string;
  logo?: string;
  signature?: string;
  description: string;
  type: CertificateType;
  region?: string;
  certificateType?: string;
}
