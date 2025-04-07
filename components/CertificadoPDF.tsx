"use client";

import React from "react";
import {
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  View,
} from "@react-pdf/renderer";

// Estructura del certificado
export interface CertificadoData {
  encabezado: {
    titulo: string;
    imagenHeader: string; // base64
  };
  autores: Array<{ nombre: string; dni: string }>;
  capitulo: {
    numero: number;
    titulo: string;
    urlValidacion: string;
    qrBase64?: string;
    contenidoHtml?: string; // Texto del editor (HTML)
  };
  footer: {
    lugar: string;
    fecha: string;
    imagenFirma: string;
    imagenSello: string;
    imagenFooter: string;
  };
}

// Estilos básicos (limitar imágenes a 120x100)
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.3,
  },
  headerImage: { width: "100%", maxHeight: 80, objectFit: "contain" },
  miniImage: { width: 120, height: 100, objectFit: "contain" },
  footerImage: { width: "100%", objectFit: "contain", marginTop: 10 },
  sectionTitle: { fontSize: 12, fontWeight: "bold", marginTop: 10 },
});

export function CertificadoPDF({ data }: { data: CertificadoData }) {
  const { encabezado, autores, capitulo, footer } = data;

  // Extraemos texto "plano" del contenido HTML (editor.js)
  const parsedContent = capitulo.contenidoHtml
    ? capitulo.contenidoHtml.replace(/<[^>]+>/g, "")
    : "";

  return (
    <Document>
      <Page size='A4' style={styles.page}>
        {/* Imagen encabezado */}
        {encabezado.imagenHeader && (
          <Image src={encabezado.imagenHeader} style={styles.headerImage} />
        )}

        {/* Título */}
        <Text style={{ fontSize: 14, fontWeight: "bold", marginTop: 5 }}>
          {encabezado.titulo}
        </Text>

        {/* Texto del editor (contenido) */}
        {parsedContent && (
          <Text style={{ marginTop: 10 }}>{parsedContent}</Text>
        )}

        {/* Autores */}
        <Text style={styles.sectionTitle}>Autores:</Text>
        {autores.map((a, i) => (
          <Text key={i}>
            • {a.nombre} (DNI: {a.dni})
          </Text>
        ))}

        {/* Capítulo */}
        <Text style={styles.sectionTitle}>
          Capítulo Nº {capitulo.numero}: {capitulo.titulo}
        </Text>

        {/* QR */}
        {capitulo.qrBase64 && (
          <Image
            src={capitulo.qrBase64}
            style={[styles.miniImage, { marginVertical: 8 }]}
          />
        )}

        {/* Firma y sello */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20,
          }}>
          {footer.imagenFirma && (
            <Image src={footer.imagenFirma} style={styles.miniImage} />
          )}
          {footer.imagenSello && (
            <Image src={footer.imagenSello} style={styles.miniImage} />
          )}
        </View>

        {/* Fecha y lugar */}
        <Text style={{ marginTop: 10 }}>
          {footer.lugar}, a {footer.fecha}
        </Text>

        {/* Imagen footer */}
        {footer.imagenFooter && (
          <Image src={footer.imagenFooter} style={styles.footerImage} />
        )}
      </Page>
    </Document>
  );
}
