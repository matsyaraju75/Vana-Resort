import pptxgen from 'pptxgenjs';

async function test() {
  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  const slide = pptx.addSlide();
  slide.addText('Vana Resort Araku', { x: 1, y: 1, fontSize: 28, bold: true, color: '1B4332' });
  await pptx.writeFile({ fileName: 'test.pptx' });
  console.log('Test PPTX generated successfully!');
}

test().catch(console.error);
