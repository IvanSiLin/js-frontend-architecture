import '@testing-library/jest-dom';
import fs from 'fs';
import path from 'path';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import run from '../src/application.js';

const laptops = [
  {
    model: 'v1', processor: 'intel', frequency: 1.7, memory: 16,
  },
  {
    model: 'd3', processor: 'intel', frequency: 3.5, memory: 8,
  },
  {
    model: 'd2', processor: 'amd', frequency: 2.5, memory: 16,
  },
];

beforeEach(() => {
  const initHtml = fs.readFileSync(path.join('__fixtures__', 'index.html')).toString();
  document.body.innerHTML = initHtml;
  run(laptops);
});

test('working process', async () => {
  const result = document.querySelector('.result');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');

  const processor = await screen.findByLabelText('Processor');
  await userEvent.selectOptions(processor, 'Intel');
  const memory = await screen.findByLabelText('Memory');
  await userEvent.selectOptions(memory, '8');
  expect(result).toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d2');

  await userEvent.selectOptions(processor, 'AMD');
  expect(result).not.toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d2');

  await userEvent.selectOptions(processor, 'Intel');
  expect(result).toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d2');

  await userEvent.selectOptions(processor, '');
  await userEvent.selectOptions(memory, '');

  const frequencyMin = await screen.findByLabelText('Frequency Min');
  await userEvent.type(frequencyMin, '3');
  expect(result).toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d2');

  await userEvent.clear(frequencyMin);
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');

  await userEvent.type(frequencyMin, '4');
  expect(result).toBeEmptyDOMElement();

  await userEvent.clear(frequencyMin);
  await userEvent.type(frequencyMin, '1');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');

  const frequencyMax = await screen.findByLabelText('Frequency Max');
  await userEvent.type(frequencyMax, '2');
  expect(result).toHaveTextContent('v1');
  expect(result).not.toHaveTextContent('d3');
  expect(result).not.toHaveTextContent('d2');

  await userEvent.clear(frequencyMin);
  await userEvent.clear(frequencyMax);
  // const memory = await screen.findByLabelText('Memory');
  await userEvent.selectOptions(memory, '16');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d2');
  expect(result).not.toHaveTextContent('d3');
});

test('initial state', async () => {
  const result = document.querySelector('.result');
  expect(result).toHaveTextContent('v1');
  expect(result).toHaveTextContent('d3');
  expect(result).toHaveTextContent('d2');
});
