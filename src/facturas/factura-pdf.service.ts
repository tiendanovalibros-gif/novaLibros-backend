import { Injectable } from '@nestjs/common';
import PDFDocument = require('pdfkit');
import type { Response } from 'express';

interface DatosFactura {
  numeroOrden: string;
  fechaOrden: Date | string;
  nombreUsuario: string;
  correoUsuario: string;
  items: {
    titulo: string;
    cantidad: number;
    precioUnitario: number;
    subtotalLinea: number;
  }[];
  subtotal: number;
  iva: number;
  montoTotal: number;
}

@Injectable()
export class FacturaPdfService {
  generarPdf(datos: DatosFactura, res: Response): void {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="factura-${datos.numeroOrden}.pdf"`,
    );
    doc.pipe(res);

    // ── Encabezado ────────────────────────────────────────────────────────────
    doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#1e40af')
      .text('NovaLibros', 50, 50);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#64748b')
      .text('Factura Electrónica', 50, 80);

    doc
      .fontSize(10)
      .fillColor('#0f172a')
      .text(`Orden: ${datos.numeroOrden}`, 350, 50, { align: 'right' })
      .text(
        `Fecha: ${new Date(datos.fechaOrden).toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`,
        350,
        65,
        { align: 'right' },
      );

    // ── Línea separadora ──────────────────────────────────────────────────────
    doc.moveTo(50, 105).lineTo(545, 105).strokeColor('#e2e8f0').stroke();

    // ── Datos del cliente ─────────────────────────────────────────────────────
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#0f172a')
      .text('Cliente', 50, 120);

    doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#334155')
      .text(datos.nombreUsuario, 50, 135)
      .text(datos.correoUsuario, 50, 150);

    // ── Tabla de items ────────────────────────────────────────────────────────
    let y = 190;

    // Cabecera tabla
    doc.rect(50, y, 495, 22).fill('#f1f5f9');
    doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#475569')
      .text('Descripción', 58, y + 6)
      .text('Cant.', 350, y + 6)
      .text('P. Unit.', 390, y + 6)
      .text('Subtotal', 460, y + 6);

    y += 22;

    // Filas
    datos.items.forEach((item, idx) => {
      if (idx % 2 === 0) {
        doc.rect(50, y, 495, 22).fill('#ffffff');
      } else {
        doc.rect(50, y, 495, 22).fill('#f8fafc');
      }

      doc
        .fontSize(9)
        .font('Helvetica')
        .fillColor('#0f172a')
        .text(item.titulo, 58, y + 6, { width: 280, ellipsis: true })
        .text(String(item.cantidad), 355, y + 6)
        .text(`$${item.precioUnitario.toLocaleString('es-CO')}`, 385, y + 6)
        .text(`$${item.subtotalLinea.toLocaleString('es-CO')}`, 455, y + 6);

      y += 22;
    });

    // ── Totales ───────────────────────────────────────────────────────────────
    y += 15;
    doc.moveTo(350, y).lineTo(545, y).strokeColor('#e2e8f0').stroke();
    y += 10;

    doc
      .fontSize(9)
      .font('Helvetica')
      .fillColor('#334155')
      .text('Subtotal:', 370, y)
      .text(`$${datos.subtotal.toLocaleString('es-CO')}`, 455, y);

    y += 16;
    doc
      .text('IVA (19%):', 370, y)
      .text(`$${datos.iva.toLocaleString('es-CO')}`, 455, y);

    y += 16;
    doc.moveTo(350, y).lineTo(545, y).strokeColor('#e2e8f0').stroke();
    y += 8;

    doc
      .fontSize(11)
      .font('Helvetica-Bold')
      .fillColor('#0f172a')
      .text('Total:', 370, y)
      .text(`$${datos.montoTotal.toLocaleString('es-CO')}`, 455, y);

    // ── Pie ───────────────────────────────────────────────────────────────────
    doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#94a3b8')
      .text('Gracias por tu compra en NovaLibros.', 50, 720, {
        align: 'center',
        width: 495,
      });

    doc.end();
  }
}
