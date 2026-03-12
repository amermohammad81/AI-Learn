import type { StudyPack } from "@/lib/study-pack";

type JsPdfType = {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  setFontSize: (size: number) => void;
  text: (text: string | string[], x: number, y: number) => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  addPage: () => void;
  save: (filename: string) => void;
};

async function createDoc(title: string): Promise<{ doc: JsPdfType; y: number }> {
  const mod = (await import("jspdf")) as unknown as { jsPDF: new () => JsPdfType };
  const doc = new mod.jsPDF();
  doc.setFontSize(18);
  doc.text(title, 40, 40);
  return { doc, y: 70 };
}

function writeParagraph(doc: JsPdfType, text: string, y: number): number {
  const width = doc.internal.pageSize.getWidth() - 80;
  const pageHeight = doc.internal.pageSize.getHeight();
  const lines = doc.splitTextToSize(text, width);
  let cursor = y;

  doc.setFontSize(11);
  for (const line of lines) {
    if (cursor > pageHeight - 40) {
      doc.addPage();
      cursor = 40;
    }
    doc.text(line, 40, cursor);
    cursor += 16;
  }
  return cursor + 8;
}

export async function downloadSummaryPdf(pack: StudyPack): Promise<void> {
  const { doc, y } = await createDoc("Lecture Summary");
  const nextY = writeParagraph(doc, pack.summary, y);
  writeParagraph(doc, `Model: ${pack.model}`, nextY);
  doc.save("summary.pdf");
}

export async function downloadFlashcardsPdf(pack: StudyPack): Promise<void> {
  const { doc, y } = await createDoc("Flashcards");
  let cursor = y;
  pack.flashcards.forEach((card, idx) => {
    cursor = writeParagraph(doc, `${idx + 1}. Q: ${card.question}`, cursor);
    cursor = writeParagraph(doc, `A: ${card.answer}`, cursor);
  });
  doc.save("flashcards.pdf");
}

export async function downloadQuizPdf(pack: StudyPack): Promise<void> {
  const { doc, y } = await createDoc("Quiz");
  let cursor = y;
  pack.quizzes.forEach((quiz, idx) => {
    cursor = writeParagraph(doc, `${idx + 1}. ${quiz.question}`, cursor);
    quiz.options.forEach((opt, optIdx) => {
      cursor = writeParagraph(doc, `   ${optIdx + 1}) ${opt}`, cursor);
    });
    cursor = writeParagraph(doc, `Correct: ${quiz.options[quiz.correct_index]}`, cursor);
    cursor = writeParagraph(doc, `Explanation: ${quiz.explanation}`, cursor);
  });
  doc.save("quiz.pdf");
}
