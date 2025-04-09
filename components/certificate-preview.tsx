"use client";

import { useEffect, useState } from "react";
import type { CertificateData } from "@/types/certificate";
import { QRCodeSVG } from "qrcode.react";

interface CertificatePreviewProps {
  data: CertificateData;
}

export function CertificatePreview({ data }: CertificatePreviewProps) {
  const [certificateContent, setCertificateContent] = useState<string>("");

  useEffect(() => {
    // Generate certificate content based on type
    let content = "";

    switch (data.type) {
      case "chapter":
        content = generateChapterCertificate(data);
        break;
      case "book":
        content = generateBookCertificate(data);
        break;
      case "region":
        content = generateRegionalCertificate(data);
        break;
    }

    setCertificateContent(content);
  }, [data]);

  return (
    <div className='relative w-full h-full flex flex-col'>
      {/* Header */}
      <div className='text-center mb-4'>
        {data.headerImage && (
          <img
            src={(data.headerImage as string) || "/placeholder.svg"}
            alt='Cabecera'
            className='max-h-20 mx-auto mb-2'
          />
        )}
        {data.logo && (
          <img
            src={(data.logo as string) || "/placeholder.svg"}
            alt='Logo'
            className='max-h-16 mx-auto mb-2'
          />
        )}
        <h1 className='text-2xl font-bold'>{data.title || "CERTIFICADO"}</h1>
      </div>

      {/* Content */}
      <div
        className='flex-grow text-center px-8 py-4'
        dangerouslySetInnerHTML={{ __html: certificateContent }}
      />

      {/* Footer */}
      <div className='mt-auto text-center'>
        {data.validationUrl && (
          <div className='flex justify-center mb-4'>
            <QRCodeSVG value={data.validationUrl} size={100} />
          </div>
        )}

        {data.signature && (
          <div className='mb-2'>
            <img
              src={(data.signature as string) || "/placeholder.svg"}
              alt='Firma'
              className='max-h-16 mx-auto'
            />
            <p className='text-sm'>Firma Digital</p>
          </div>
        )}

        {data.footerImage && (
          <img
            src={(data.footerImage as string) || "/placeholder.svg"}
            alt='Pie'
            className='max-h-12 mx-auto mt-2'
          />
        )}
      </div>
    </div>
  );
}

function generateChapterCertificate(data: CertificateData): string {
  const authors = data.authors.join(", ");
  const coauthors =
    data.coauthors.length > 0
      ? `<p>Coautores: ${data.coauthors.join(", ")}</p>`
      : "";

  return `
    <p class="mb-6">Por la presente se certifica que:</p>
    
    <p class="text-xl font-semibold mb-4">${authors}</p>
    
    <p class="mb-4">Es autor/a del capítulo titulado:</p>
    
    <p class="text-lg font-semibold mb-4">"${data.chapterTitle}"</p>
    
    <p class="mb-4">Publicado en el libro:</p>
    
    <p class="text-lg font-semibold mb-4">"${data.bookTitle}"</p>
    
    ${coauthors}
    
    <p class="mt-4">ISBN: ${data.isbn}</p>
    <p>Páginas: ${data.pages}</p>
    <p>Fecha de publicación: ${formatDate(data.publicationDate)}</p>
  `;
}

function generateBookCertificate(data: CertificateData): string {
  const authors = data.authors.join(", ");
  const coauthors =
    data.coauthors.length > 0
      ? `<p>Coautores: ${data.coauthors.join(", ")}</p>`
      : "";

  return `
    <p class="mb-6">Por la presente se certifica que:</p>
    
    <p class="text-xl font-semibold mb-4">${authors}</p>
    
    <p class="mb-4">Es autor/a del libro titulado:</p>
    
    <p class="text-lg font-semibold mb-4">"${data.bookTitle}"</p>
    
    ${coauthors}
    
    <p class="mt-4">ISBN: ${data.isbn}</p>
    <p>Total de páginas: ${data.totalPages}</p>
    <p>Fecha de publicación: ${formatDate(data.publicationDate)}</p>
  `;
}

function generateRegionalCertificate(data: CertificateData): string {
  const authors = data.authors.join(", ");
  const coauthors =
    data.coauthors.length > 0
      ? `<p>Coautores: ${data.coauthors.join(", ")}</p>`
      : "";

  return `
    <p class="mb-6">Por la presente se certifica que:</p>
    
    <p class="text-xl font-semibold mb-4">${authors}</p>
    
    <p class="mb-4">Es autor/a del ${
      data.type === "chapter" ? "capítulo" : "libro"
    } titulado:</p>
    
    <p class="text-lg font-semibold mb-4">"${
      data.type === "chapter" ? data.chapterTitle : data.bookTitle
    }"</p>
    
    ${
      data.type === "chapter"
        ? `
      <p class="mb-4">Publicado en el libro:</p>
      <p class="text-lg font-semibold mb-4">"${data.bookTitle}"</p>
    `
        : ""
    }
    
    ${coauthors}
    
    <p class="mt-4">ISBN: ${data.isbn}</p>
    <p>Páginas: ${data.pages}</p>
    <p>Total de páginas: ${data.totalPages}</p>
    <p>Fecha de publicación: ${formatDate(data.publicationDate)}</p>
    
    <p class="mt-6 font-semibold">Este certificado es válido para la Comunidad Autónoma de ${
      data.region
    }</p>
  `;
}

function formatDate(dateString: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
