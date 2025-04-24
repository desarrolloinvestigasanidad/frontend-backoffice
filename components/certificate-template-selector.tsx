"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import type { CertificateTemplate } from "@/types/certificate";

interface CertificateTemplateSelectorProps {
  onSelect: (template: CertificateTemplate) => void;
}

export function CertificateTemplateSelector({
  onSelect,
}: CertificateTemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const templates: CertificateTemplate[] = [
    {
      id: "template1",
      name: "Estándar",
      title: "CERTIFICADO",
      headerImage: "/abstract-geometric-header.png",
      footerImage: "/website-footer-abstract.png",
      logo: "/abstract-geometric-logo.png",
      signature: "/handwritten-agreement.png",
      description: "Plantilla estándar para certificados generales.",
      type: "book",
    },
    {
      id: "template2",
      name: "Científico",
      title: "CERTIFICADO CIENTÍFICO",
      headerImage: "/abstract-geometric-header.png",
      footerImage: "/website-footer-abstract.png",
      logo: "/world-map-continents.png",
      signature: "/handwritten-agreement.png",
      description: "Plantilla diseñada para certificados científicos.",
      type: "chapter",
    },
    {
      id: "template3",
      name: "Regional",
      title: "CERTIFICADO REGIONAL",
      headerImage: "/abstract-geometric-header.png",
      footerImage: "/website-footer-abstract.png",
      logo: "/world-map-continents.png",
      signature: "/handwritten-agreement.png",
      description: "Plantilla para certificados regionales.",
      type: "region",
    },
  ];

  const handleSelect = (template: CertificateTemplate) => {
    setSelectedTemplate(template.id);
    onSelect(template);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-md ${
            selectedTemplate === template.id
              ? "border-2 border-purple-500 dark:border-purple-400"
              : "border border-slate-200 dark:border-slate-700"
          }`}
          onClick={() => handleSelect(template)}>
          <div className='flex flex-col items-center space-y-3'>
            <div className='relative w-full h-24 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden'>
              {template.headerImage && (
                <img
                  src={template.headerImage || "/placeholder.svg"}
                  alt={`Plantilla ${template.name}`}
                  className='w-full h-full object-cover'
                />
              )}
              {selectedTemplate === template.id && (
                <div className='absolute top-2 right-2 bg-purple-500 text-white rounded-full p-1'>
                  <Check className='h-4 w-4' />
                </div>
              )}
            </div>
            <h3 className='font-medium text-center'>{template.name}</h3>
          </div>
        </Card>
      ))}
    </div>
  );
}
