"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CertificateForm } from "@/components/certificate-form";
import { CertificatePreview } from "@/components/certificate-preview";
import { CertificateTemplateSelector } from "@/components/certificate-template-selector";
import { CertificateDataSelector } from "@/components/certificate-data-selector";
import { generatePDF } from "@/lib/pdf-generator";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Save,
  RefreshCw,
  Search,
  BookOpen,
  Users,
  FileText,
  ImageIcon,
  Settings,
  ChevronLeft,
  ChevronRight,
  Check,
  Eye,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import type {
  CertificateType,
  CertificateData,
  CertificateTemplate,
} from "@/types/certificate";

const steps = [
  {
    id: "type",
    title: "Tipo de Certificado",
    icon: <FileText className='h-5 w-5' />,
  },
  {
    id: "data",
    title: "Información Básica",
    icon: <BookOpen className='h-5 w-5' />,
  },
  { id: "authors", title: "Autores", icon: <Users className='h-5 w-5' /> },
  { id: "images", title: "Imágenes", icon: <ImageIcon className='h-5 w-5' /> },
  {
    id: "advanced",
    title: "Configuración",
    icon: <Settings className='h-5 w-5' />,
  },
  { id: "preview", title: "Vista Previa", icon: <Eye className='h-5 w-5' /> },
];

export function CertificateEditor() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    type: "chapter",
    title: "CERTIFICADO",
    bookTitle: "",
    chapterTitle: "",
    chapterNumber: "",
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
    editionId: "",
    bookId: "",
    userId: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<CertificateTemplate | null>(null);
  const [isDataSelectorOpen, setIsDataSelectorOpen] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleDataChange = (data: Partial<CertificateData>) => {
    setCertificateData((prev) => ({ ...prev, ...data }));
  };

  const handleTypeChange = (type: CertificateType) => {
    setCertificateData((prev) => ({ ...prev, type }));
  };

  const handleTemplateSelect = (template: CertificateTemplate) => {
    setSelectedTemplate(template);
    // Apply template settings to the certificate data
    setCertificateData((prev) => ({
      ...prev,
      title: template.title || prev.title,
      headerImage: template.headerImage || prev.headerImage,
      footerImage: template.footerImage || prev.footerImage,
      logo: template.logo || prev.logo,
      signature: template.signature || prev.signature,
    }));
  };

  const handleGeneratePDF = async () => {
    if (previewRef.current) {
      setIsLoading(true);
      try {
        await generatePDF(previewRef.current, certificateData);
        toast({
          title: "PDF generado correctamente",
          description: "El certificado se ha descargado en tu dispositivo.",
          variant: "default",
        });
      } catch (error) {
        console.error("Error al generar PDF:", error);
        toast({
          title: "Error al generar PDF",
          description:
            "Ha ocurrido un error al generar el certificado. Inténtalo de nuevo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    // Simulate API call to save template
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Plantilla guardada",
        description:
          "La plantilla de certificado se ha guardado correctamente.",
        variant: "default",
      });
    }, 1500);
  };

  const handleDataSelect = (data: any) => {
    // Update certificate data based on selected book, edition, or user
    setCertificateData((prev) => ({
      ...prev,
      ...data,
    }));
    setIsDataSelectorOpen(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Calculate progress percentage
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className='space-y-8'>
      {/* Progress bar and steps */}
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-slate-800 dark:text-slate-200'>
            {steps[currentStep].title}
          </h2>
          <Button
            variant='outline'
            size='sm'
            onClick={togglePreview}
            className='flex items-center gap-2'>
            <Eye className='h-4 w-4' />
            {showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
          </Button>
        </div>

        <Progress value={progress} className='h-2' />

        <div className='hidden md:flex justify-between'>
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => goToStep(index)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                index === currentStep
                  ? "text-purple-600 dark:text-purple-400"
                  : index < currentStep
                  ? "text-green-600 dark:text-green-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}>
              <div
                className={`rounded-full p-2 ${
                  index === currentStep
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    : index < currentStep
                    ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500"
                }`}>
                {index < currentStep ? (
                  <Check className='h-5 w-5' />
                ) : (
                  step.icon
                )}
              </div>
              <span className='text-xs font-medium'>{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={`grid ${
          showPreview ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
        } gap-8`}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className='space-y-6'>
            <Card className='p-6 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-lg'>
              {/* Step 1: Type Selection */}
              {currentStep === 0 && (
                <div className='space-y-6'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Selecciona el tipo de certificado
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <Button
                      variant={
                        certificateData.type === "chapter"
                          ? "default"
                          : "outline"
                      }
                      className={`h-auto py-6 flex flex-col gap-3 ${
                        certificateData.type === "chapter"
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          : ""
                      }`}
                      onClick={() => handleTypeChange("chapter")}>
                      <FileText className='h-8 w-8' />
                      <span className='text-lg font-medium'>
                        Certificado de Capítulo
                      </span>
                    </Button>
                    <Button
                      variant={
                        certificateData.type === "book" ? "default" : "outline"
                      }
                      className={`h-auto py-6 flex flex-col gap-3 ${
                        certificateData.type === "book"
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          : ""
                      }`}
                      onClick={() => handleTypeChange("book")}>
                      <BookOpen className='h-8 w-8' />
                      <span className='text-lg font-medium'>
                        Certificado de Libro
                      </span>
                    </Button>
                    <Button
                      variant={
                        certificateData.type === "region"
                          ? "default"
                          : "outline"
                      }
                      className={`h-auto py-6 flex flex-col gap-3 ${
                        certificateData.type === "region"
                          ? "bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                          : ""
                      }`}
                      onClick={() => handleTypeChange("region")}>
                      <Users className='h-8 w-8' />
                      <span className='text-lg font-medium'>
                        Certificado Regional
                      </span>
                    </Button>
                  </div>

                  <div className='mt-8'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Plantillas disponibles
                    </h3>
                    <CertificateTemplateSelector
                      onSelect={handleTemplateSelect}
                    />
                  </div>

                  <div className='mt-4'>
                    <Button
                      variant='outline'
                      onClick={() => setIsDataSelectorOpen(true)}
                      className='flex items-center gap-2 w-full'>
                      <Search className='h-4 w-4' />
                      Buscar datos de libros, ediciones o usuarios
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Basic Information */}
              {currentStep === 1 && (
                <CertificateForm
                  type={certificateData.type}
                  data={certificateData}
                  onChange={handleDataChange}
                  section='basic-info'
                />
              )}

              {/* Step 3: Authors */}
              {currentStep === 2 && (
                <CertificateForm
                  type={certificateData.type}
                  data={certificateData}
                  onChange={handleDataChange}
                  section='authors'
                />
              )}

              {/* Step 4: Images */}
              {currentStep === 3 && (
                <CertificateForm
                  type={certificateData.type}
                  data={certificateData}
                  onChange={handleDataChange}
                  section='images'
                />
              )}

              {/* Step 5: Advanced Configuration */}
              {currentStep === 4 && (
                <CertificateForm
                  type={certificateData.type}
                  data={certificateData}
                  onChange={handleDataChange}
                  section='advanced'
                />
              )}

              {/* Step 6: Preview and Generate */}
              {currentStep === 5 && (
                <div className='space-y-6'>
                  <h3 className='text-lg font-semibold mb-4'>
                    Generar certificado
                  </h3>
                  <p className='text-slate-600 dark:text-slate-400'>
                    Revisa la vista previa del certificado y genera el PDF
                    cuando estés conforme con el resultado.
                  </p>

                  <div className='flex flex-col sm:flex-row gap-4 mt-6'>
                    <Button
                      onClick={handleSaveTemplate}
                      disabled={isSaving}
                      variant='outline'
                      className='flex items-center gap-2'>
                      <Save className='h-4 w-4' />
                      {isSaving ? "Guardando..." : "Guardar plantilla"}
                    </Button>

                    <Button
                      onClick={handleGeneratePDF}
                      disabled={isLoading}
                      className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2'>
                      {isLoading ? (
                        <RefreshCw className='h-4 w-4 animate-spin' />
                      ) : (
                        <Download className='h-4 w-4' />
                      )}
                      {isLoading ? "Generando..." : "Generar PDF"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className='flex justify-between mt-8'>
                <Button
                  variant='outline'
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className='flex items-center gap-2'>
                  <ChevronLeft className='h-4 w-4' />
                  Anterior
                </Button>

                {currentStep < steps.length - 1 ? (
                  <Button
                    onClick={nextStep}
                    className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2'>
                    Siguiente
                    <ChevronRight className='h-4 w-4' />
                  </Button>
                ) : (
                  <Button
                    onClick={handleGeneratePDF}
                    disabled={isLoading}
                    className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white flex items-center gap-2'>
                    {isLoading ? (
                      <RefreshCw className='h-4 w-4 animate-spin' />
                    ) : (
                      <Download className='h-4 w-4' />
                    )}
                    {isLoading ? "Generando..." : "Generar PDF"}
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Preview panel - only shown when showPreview is true */}
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}>
            <Card className='p-6 backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-lg'>
              <h2 className='text-xl font-semibold mb-4 flex items-center gap-2'>
                <FileText className='h-5 w-5 text-purple-600 dark:text-purple-400' />
                Vista Previa
              </h2>
              <div
                className='border rounded-md p-4 bg-white dark:bg-slate-900 shadow-inner overflow-hidden'
                style={{
                  height: "842px",
                  width: "100%",
                  maxWidth: "595px",
                  margin: "0 auto",
                }}>
                <div ref={previewRef} className='h-full w-full'>
                  <CertificatePreview data={certificateData} />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {isDataSelectorOpen && (
        <CertificateDataSelector
          onSelect={handleDataSelect}
          onClose={() => setIsDataSelectorOpen(false)}
        />
      )}
    </div>
  );
}
