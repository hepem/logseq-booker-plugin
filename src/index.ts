import { Book } from './models/Book';
import { getTemplate, templatesList } from './template';
import { isbn, findEmptyRowIndex, formatBookRow, replaceTableRow, getTableColumnCount, addEmptyRowToTable } from './helpers';

function main() {
  logseq.UI.showMsg("Hello from Booker! 🚀", "success");

  for (const template of templatesList) {
    logseq.Editor.registerSlashCommand(`booker:table:${template}`, async () => {
      const block = await logseq.Editor.getCurrentBlock();
      if (block?.content) {
        logseq.UI.showMsg("Block must be empty to create a table", "error");
        return;
      }

      const { _, uuid } = block;
        
      const templateContent = getTemplate(template);
      await logseq.Editor.updateBlock(uuid, templateContent);
    });
  }

  logseq.Editor.registerSlashCommand('booker:insert', async () => {
    const block = await logseq.Editor.getCurrentBlock();
    if (!block) return;
    
    const { content, uuid } = block;

    const isbnValue = isbn(content);

    if (!isbnValue) {
      logseq.UI.showMsg(`[:h1 "No ISBN found!"]`);
      return;
    }

    // Logic to get book info from Google Books API


    // Create the book object
    const book: Book = {
      isbn: isbnValue,
      title: 'test',
      authors: ['test'],
      pages: 100,
    };

    // Insert into the table
    const previousTable = await logseq.Editor.getPreviousSiblingBlock(uuid);
    
    if (!previousTable?.content) {
      logseq.UI.showMsg("No table found above the current block", "error");
      return;
    }
    
    const tableIndex = findEmptyRowIndex(previousTable.content);
    
    if (tableIndex === -1) {
      logseq.UI.showMsg("No empty row found in the table", "error");
      return;
    }
    
    const columnCount = getTableColumnCount(previousTable.content);
    const newRow = formatBookRow(book, columnCount);
    let updatedTableContent = replaceTableRow(previousTable.content, tableIndex, newRow);
    updatedTableContent = addEmptyRowToTable(updatedTableContent, columnCount);
    await logseq.Editor.updateBlock(previousTable.uuid, updatedTableContent);
    
    logseq.UI.showMsg("Book inserted successfully! 📚", "success");
  });
}

logseq.ready(main).catch(console.error);