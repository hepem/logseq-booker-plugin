import { getTemplate, templatesList } from './template';

function isbn(data: string): string | null {
  const isbnMatch = data.match(/^\d{10,13}\s*$/);
  if (!isbnMatch) return null;
  
  const isbn = data.match(/\d{10,13}(?=\s*$)/)?.[0];
  return isbn || null;
}

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

    logseq.UI.showMsg(`ISBN: ${isbnValue}`);
  });
}

logseq.ready(main).catch(console.error);