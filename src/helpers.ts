import { Book } from './models/Book';

/**
 * Extracts and validates an ISBN from a text string
 * @param data - Text string that may contain an ISBN
 * @returns The found ISBN (10 or 13 digits) or null if no valid ISBN is found
 * @example
 * isbn("1234567890") // "1234567890"
 * isbn("El libro ISBN 9781234567890") // "9781234567890"
 * isbn("texto sin ISBN") // null
 */
export function isbn(data: string): string | null {
    const isbnMatch = data.match(/^\d{10,13}\s*$/);
    if (!isbnMatch) return null;

    const isbn = data.match(/\d{10,13}(?=\s*$)/)?.[0];
    return isbn || null;
}

/**
 * Detects if a markdown table row is empty
 * @param row - Markdown table row (e.g.: "|     |       |         |")
 * @returns true if the row is empty (all cells empty or only spaces)
 */
export function isEmptyTableRow(row: string): boolean {
    // Option 1: Simple regex - detects rows with only pipes and spaces
    // Ignores the separator (|-----|) and completely empty rows
    const emptyRowPattern = /^\|\s*(\|\s*)*\|?\s*$/;
    if (emptyRowPattern.test(row.trim())) {
        return true;
    }

    // Option 2: Parse and verify that all cells are empty
    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell !== '');
    // If there are no cells with content, the row is empty
    return cells.length === 0 || cells.every(cell => cell === '');
}

/**
 * Finds the first empty row in a markdown table
 * @param tableContent - Complete table content
 * @returns Index of the first empty row, or -1 if there is none
 */
export function findEmptyRowIndex(tableContent: string): number {
    const rows = tableContent.split('\n').slice(2);
    console.log(rows);
    return rows.findIndex(row => isEmptyTableRow(row));
}

/**
 * Gets the number of columns in a markdown table
 * @param tableContent - Complete table content
 * @returns Number of columns in the table
 */
export function getTableColumnCount(tableContent: string): number {
    const headerRow = tableContent.split('\n')[0];
    if (!headerRow) return 0;

    const columns = headerRow.split('|').filter(cell => cell.trim() !== '').length;
    return columns;
}

/**
 * Formats a markdown table row with book data
 * @param book - Book object with book data
 * @param columnCount - Number of columns in the table
 * @returns Formatted row in markdown format
 */
export function formatBookRow(book: Book, columnCount: number): string {
    const cells: string[] = [];
    
    cells.push(book.isbn || '');
    cells.push(book.title || '');
    cells.push(book.authors?.join(', ') || '');
    cells.push(book.pages?.toString() || '');
    cells.push(book.dateAdded || '');
    cells.push(book.dateFinished || '');
    
    if (columnCount >= 7) {
        cells.push(book.rating?.toString() || '');
    }
    
    if (columnCount >= 8) {
        cells.push(book.review || '');
    }
    
    while (cells.length < columnCount) {
        cells.push('');
    }
    
    return `| ${cells.join(' | ')} |`;
}

/**
 * Replaces a specific row in a markdown table content
 * @param tableContent - Complete table content
 * @param rowIndex - Index of the row to replace (0-based, excluding header and separator)
 * @param newRow - New row in markdown format
 * @returns Table content with the replaced row
 */
export function replaceTableRow(tableContent: string, rowIndex: number, newRow: string): string {
    const lines = tableContent.split('\n');
    
    const header = lines[0];
    const separator = lines[1];
    const dataRows = lines.slice(2);
    
    if (rowIndex < 0 || rowIndex >= dataRows.length) {
        throw new Error(`Invalid row index: ${rowIndex}. The table has ${dataRows.length} data rows.`);
    }
    
    dataRows[rowIndex] = newRow;
    
    return [header, separator, ...dataRows].join('\n');
}

/**
 * Creates an empty row for a markdown table
 * @param columnCount - Number of columns in the table
 * @returns Empty row formatted in markdown format
 */
export function createEmptyRow(columnCount: number): string {
    const emptyCells = Array(columnCount).fill('');
    return `| ${emptyCells.join(' | ')} |`;
}

/**
 * Adds an empty row to the end of a markdown table
 * @param tableContent - Complete table content
 * @param columnCount - Number of columns in the table
 * @returns Table content with a new empty row at the end
 */
export function addEmptyRowToTable(tableContent: string, columnCount: number): string {
    const emptyRow = createEmptyRow(columnCount);
    return `${tableContent}\n${emptyRow}`;
}