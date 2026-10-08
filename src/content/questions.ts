import { logs, type Question } from "./logs";
import { pageHref, subtopicPages } from "./subtopic-pages";

/** Where a question was set: a day or a subtopic page, so /code can link back to it. */
export type QuestionEntry = { question: Question; href: string; label: string };

/** Every practice question on the site, by id (the first place it appears wins). */
export const questionsById = new Map<string, QuestionEntry>();
for (const log of logs) {
  for (const question of log.questions) {
    if (!questionsById.has(question.id)) {
      questionsById.set(question.id, { question, href: `/day/${log.day}`, label: `Day ${log.day}` });
    }
  }
}
for (const page of subtopicPages) {
  for (const question of page.questions) {
    if (!questionsById.has(question.id))
      questionsById.set(question.id, { question, href: pageHref(page), label: page.name });
  }
}
