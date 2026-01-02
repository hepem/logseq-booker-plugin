const templatesList = ['basic', 'advanced'];

/**
 * Templates
 */
const basic = `| ISB | Title | Authors | Pages | Date added | Date Finished |
|-----|-------|---------|-------|------------|---------------|
|     |       |         |       |            |               |`;

const advanced = `| ISB | Title | Authors | Pages | Date added | Date Finished | Rating | Review |
|-----|-------|---------|-------|------------|---------------|---------|---------|
|     |       |         |       |            |               |       |       |`;


function getTemplate(templateName: string) {
  switch(templateName) {
    case 'basic':
      return basic;
    case 'advanced':
      return advanced;
    default:
      throw new Error(`Template ${templateName} not found`);
  }
}

export { getTemplate, templatesList };