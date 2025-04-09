"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CertificateForm } from "@/components/certificate-form";
import { CertificatePreview } from "@/components/certificate-preview";
import type { CertificateType, CertificateData } from "../types/certificate";
import { generatePDF } from "../lib/pdf-generator";

export function CertificateEditor() {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    type: "chapter",
    title: "",
    bookTitle: "",
    chapterTitle: "",
    authors: [],
    coauthors: [],
    isbn: "",
    pages: "",
    totalPages: "",
    publicationDate: "",
    region: "",
    validationUrl: "",
    logo: null,
    signature: null,
    headerImage: null,
    footerImage: null,
  });

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = (data: Partial<CertificateData>) => {
    setCertificateData((prev) => ({ ...prev, ...data }));
  };

  const handleTypeChange = (type: CertificateType) => {
    setCertificateData((prev) => ({ ...prev, type }));
  };

  const handleGeneratePDF = async () => {
    if (previewRef.current) {
      await generatePDF(previewRef.current, certificateData);
    }
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
      <Card className='p-6'>
        <Tabs
          defaultValue='chapter'
          onValueChange={(value) => handleTypeChange(value as CertificateType)}>
          <TabsList className='grid grid-cols-3 mb-6'>
            <TabsTrigger value='chapter'>Certificado de Capítulo</TabsTrigger>
            <TabsTrigger value='book'>Certificado de Libro</TabsTrigger>
            <TabsTrigger value='region'>Certificado Regional</TabsTrigger>
          </TabsList>

          <TabsContent value='chapter'>
            <CertificateForm
              type='chapter'
              data={certificateData}
              onChange={handleDataChange}
            />
          </TabsContent>

          <TabsContent value='book'>
            <CertificateForm
              type='book'
              data={certificateData}
              onChange={handleDataChange}
            />
          </TabsContent>

          <TabsContent value='region'>
            <CertificateForm
              type='region'
              data={certificateData}
              onChange={handleDataChange}
            />
          </TabsContent>
        </Tabs>

        <Button className='w-full mt-6' onClick={handleGeneratePDF}>
          Generar PDF
        </Button>
      </Card>

      <Card className='p-6'>
        <h2 className='text-xl font-semibold mb-4'>Vista Previa</h2>
        <div
          className='border rounded-md p-4 bg-white'
          style={{ height: "842px", width: "595px", margin: "0 auto" }}>
          <div ref={previewRef}>
            <CertificatePreview data={certificateData} />
          </div>
        </div>
      </Card>
    </div>
  );
}
