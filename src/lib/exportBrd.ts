import { jsPDF } from "jspdf";

interface BrdSection {
  title: string;
  content: string;
}

const BRD_TITLE = "Enron Email Analysis — Project Alpha";

function stripMarkdown(text: string): string {
  return text.replace(/\*\*/g, "").replace(/\|/g, " ").replace(/---+/g, "");
}

export function exportBrdAsPdf(sections: BrdSection[], accuracy: number) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Business Requirements Document", margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(BRD_TITLE, margin, y);
  y += 6;
  doc.text(`Accuracy: ${accuracy}% | Generated: ${new Date().toLocaleDateString()}`, margin, y);
  doc.setTextColor(0);
  y += 12;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  for (const section of sections) {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(section.title, margin, y);
    y += 8;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const cleanContent = stripMarkdown(section.content);
    const lines = doc.splitTextToSize(cleanContent, contentWidth);
    for (const line of lines) {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5;
    }
    y += 8;
  }
  doc.save("BRD_Document.pdf");
}

export async function exportBrdAsDocx(sections: BrdSection[], accuracy: number) {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import("docx");
  const { saveAs } = await import("file-saver");

  const children: InstanceType<typeof Paragraph>[] = [];

  children.push(
    new Paragraph({
      children: [new TextRun({ text: "Business Requirements Document", bold: true, size: 36, font: "Calibri" })],
      heading: HeadingLevel.TITLE,
      spacing: { after: 100 },
    }),
    new Paragraph({
      children: [new TextRun({ text: BRD_TITLE, italics: true, size: 22, color: "666666", font: "Calibri" })],
      spacing: { after: 50 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Accuracy: ${accuracy}% | Generated: ${new Date().toLocaleDateString()}`, size: 20, color: "999999", font: "Calibri" })],
      spacing: { after: 300 },
    })
  );

  for (const section of sections) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: section.title, bold: true, size: 26, font: "Calibri" })],
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 240, after: 120 },
      })
    );
    const nonTableLines = section.content.split("\n").filter((l) => !l.trim().startsWith("|") && l.trim());
    for (const line of nonTableLines) {
      const parts: { text: string; bold: boolean }[] = [];
      const regex = /\*\*(.*?)\*\*/g;
      let lastIdx = 0;
      let match: RegExpExecArray | null;
      while ((match = regex.exec(line)) !== null) {
        if (match.index > lastIdx) parts.push({ text: line.slice(lastIdx, match.index), bold: false });
        parts.push({ text: match[1], bold: true });
        lastIdx = regex.lastIndex;
      }
      if (lastIdx < line.length) parts.push({ text: line.slice(lastIdx), bold: false });
      if (!parts.length) parts.push({ text: line, bold: false });
      children.push(
        new Paragraph({
          children: parts.map((p) => new TextRun({ text: p.text, bold: p.bold, size: 22, font: "Calibri" })),
          spacing: { after: 80 },
        })
      );
    }
  }

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, "BRD_Document.docx");
}
