const fs = require('fs');
const path = require('path');

// Import data
const menuData = require('../data/menu.json');
const faqData = require('../data/faq.json');

interface MenuItem {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  popularity: number;
}

interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface FAQItem {
  question: string;
  answer: string;
}

function generateVertexData() {
  const outputDir = path.join(__dirname, '../data/vertex-ai');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const vertexDocuments: any[] = [];

  // Process Menu Data
  menuData.forEach((category: MenuCategory) => {
    category.items.forEach((item: MenuItem) => {
      vertexDocuments.push({
        id: `menu-${item.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`,
        jsonData: JSON.stringify({
          type: 'MenuItem',
          name: item.name,
          category: category.category,
          description: item.description || `Delicious ${item.name}`,
          price: item.price,
          currency: 'USD',
          popularity: item.popularity
        }),
        content: `Menu Item: ${item.name}\nCategory: ${category.category}\nDescription: ${item.description}\nPrice: $${item.price}`
      });
    });
  });

  // Process FAQ Data
  faqData.forEach((item: FAQItem, index: number) => {
    vertexDocuments.push({
      id: `faq-${index}`,
      jsonData: JSON.stringify({
        type: 'FAQ',
        question: item.question,
        answer: item.answer
      }),
      content: `Question: ${item.question}\nAnswer: ${item.answer}`
    });
  });

  // Output as JSONL (JSON Lines) for Vertex AI
  const outputPath = path.join(outputDir, 'vertex-import.jsonl');
  const fileStream = fs.createWriteStream(outputPath);

  vertexDocuments.forEach((doc) => {
    fileStream.write(JSON.stringify(doc) + '\n');
  });

  fileStream.end();
  console.log(`Generated ${vertexDocuments.length} documents for Vertex AI at ${outputPath}`);
}

generateVertexData();
