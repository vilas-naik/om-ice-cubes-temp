import { createWriteStream } from 'fs';
import { Document } from 'pdfjs';

// Create a new PDF document
const doc = new Document();

// Header
const headerText = 'Invoice';
// Calculate the center position based on the width of the page
const centerPosition = (doc.page.width - doc.widthOfString(headerText, { fontSize: 16, bold: true })) / 2;

// Center the text on the page
doc.text(headerText, { fontSize: 16, bold: true, x: centerPosition, align: 'center' });



// Company name
doc.text('Om Ice Cubes', { fontSize: 14, font: 'Helvetica-Bold' });


// Lorem Ipsum lines
for (let i = 0; i < 4; i++) {
  doc.text('Lorem ipsum dolor sit amet, consectetur adipiscing elit.', { fontSize: 12 });
}

// Table
const table = doc.table({
  widths: [150, 150, 150, 150],
  borderHorizontalWidth: 1,
  borderVerticalWidth: 1,
});

// First row
const firstRow = table.row();
firstRow.cell('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur eu.');
firstRow.cell('Placeholder text');
firstRow.cell('Placeholder text');
firstRow.cell('Placeholder text');

// Second row
const secondRow = table.row();
secondRow.cell('Quantity');
secondRow.cell('Item');
secondRow.cell('Rate');
secondRow.cell('Amount');

// Third row
const thirdRow = table.row();
thirdRow.cell('Placeholder text');
thirdRow.cell('Placeholder text');
thirdRow.cell('Placeholder text');
thirdRow.cell('Placeholder text');

// Fourth row
const fourthRow = table.row();
fourthRow.cell('4 lines\nof placeholder text');
fourthRow.cell('Placeholder text');
fourthRow.cell('Placeholder text');
fourthRow.cell('Placeholder text');

// Fifth row
const fifthRow = table.row();
fifthRow.cell('4 lines\nof placeholder text');
fifthRow.cell('Placeholder text');
fifthRow.cell('Placeholder text');
fifthRow.cell('Placeholder text');

// Last row
const lastRow = table.row();
lastRow.cell('Plain row spanning all across the table', { colspan: 4 });

// Save the document to a file
doc.pipe(createWriteStream('invoice1.pdf'));

// Close the document
doc.end();
